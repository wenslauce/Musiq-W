import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/spotify";
import type { 
  SpotifyPlayer, 
  SpotifyPlaybackState, 
  SpotifyTrackMetadata 
} from "@/types/spotify-playback";

// Add interface for Spotify API errors
interface SpotifyError {
  status: number;
  message: string;
}

// Type guard for Spotify errors
function isSpotifyError(error: unknown): error is SpotifyError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as SpotifyError).status === 'number'
  );
}

interface PlaybackContextType {
  player: SpotifyPlayer | null;
  deviceId: string | null;
  state: SpotifyPlaybackState | null;
  error: string | null;
  isActive: boolean;
  currentTrack: SpotifyTrackMetadata | null;
  play: (uri: string, context?: { uris?: string[]; contextUri?: string }) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getVolume: () => Promise<number>;
}

const PlaybackContext = createContext<PlaybackContextType | null>(null);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [state, setState] = useState<SpotifyPlaybackState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrackMetadata | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const [hasPremium, setHasPremium] = useState<boolean | null>(null);
  const initializingRef = useRef(false);

  // Cleanup function
  const cleanup = () => {
    if (player) {
      player.disconnect();
      setPlayer(null);
      setState(null);
      setIsActive(false);
      setCurrentTrack(null);
    }
    if (scriptRef.current) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setHasPremium(null);
    initializingRef.current = false;
  };

  // Check Premium Status
  useEffect(() => {
    if (!token) {
      setHasPremium(null);
      return;
    }

    const checkPremium = async () => {
      try {
        const user = await api.getCurrentUser(token);
        const isPremium = user.product === 'premium';
        setHasPremium(isPremium);
        
        if (!isPremium) {
          toast({
            title: "Premium Required",
            description: "Spotify Premium is required to use the Web Playback SDK",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to check premium status:', error);
        setHasPremium(false);
      }
    };

    checkPremium();
  }, [token, toast]);

  // Initialize Player
  useEffect(() => {
    if (!token || !hasPremium || initializingRef.current) return cleanup;

    const initializePlayer = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        // Verify token is still valid
        await api.getCurrentUser(token);

        // Only create script if it doesn't exist
        if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
          const script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.async = true;
          document.body.appendChild(script);
          scriptRef.current = script;
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: 'Musiq Wave',
            getOAuthToken: cb => {
              // Verify token before passing it to the player
              api.getCurrentUser(token)
                .then(() => cb(token))
                .catch(() => {
                  cleanup();
                  toast({
                    title: "Session Expired",
                    description: "Please log in again",
                    variant: "destructive"
                  });
                });
            },
            volume: 0.5
          });

          player.addListener('ready', async ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            try {
              // Get current playback state
              const playback = await api.getPlaybackState(token);
              // Only transfer if not already playing on this device
              if (!playback || playback.device.id !== device_id) {
                await api.transferPlayback(token, device_id);
              }
            } catch (error) {
              console.error('Failed to transfer playback:', error);
              if (isSpotifyError(error) && error.status === 401) {
                cleanup();
              }
            }
          });

          player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            setDeviceId(null);
          });

          player.addListener('initialization_error', ({ message }) => {
            setError(message);
            initializingRef.current = false;
            toast({
              title: "Initialization Error",
              description: message,
              variant: "destructive"
            });
          });

          player.addListener('authentication_error', ({ message }) => {
            setError(message);
            initializingRef.current = false;
            toast({
              title: "Authentication Error",
              description: message,
              variant: "destructive"
            });
          });

          player.addListener('account_error', ({ message }) => {
            setError(message);
            setHasPremium(false);
            initializingRef.current = false;
            toast({
              title: "Premium Required",
              description: "Spotify Premium is required to use this feature",
              variant: "destructive"
            });
          });

          player.addListener('playback_error', ({ message }) => {
            console.error('Failed to perform playback:', message);
            toast({
              title: "Playback Error",
              description: message,
              variant: "destructive"
            });
          });

          player.addListener('player_state_changed', state => {
            if (!state) return;
            setState(state);
            setCurrentTrack(state.track_window.current_track);
          });

          player.connect()
            .then(success => {
              if (success) {
                console.log('Successfully connected to Spotify!');
                setPlayer(player);
                setIsActive(true);
              } else {
                initializingRef.current = false;
              }
            })
            .catch(error => {
              console.error('Failed to connect to Spotify:', error);
              initializingRef.current = false;
              toast({
                title: "Connection Error",
                description: "Failed to connect to Spotify",
                variant: "destructive"
              });
            });
        };
      } catch (error) {
        console.error('Failed to initialize player:', error);
        cleanup();
        if (isSpotifyError(error) && error.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive"
          });
        }
      }
    };

    initializePlayer();
    return cleanup;
  }, [token, hasPremium, toast]);

  // Implement all player methods with error handling
  const play = async (uri: string, context?: { uris?: string[]; contextUri?: string }) => {
    if (!player || !deviceId) return;
    try {
      const playOptions: any = {
        device_id: deviceId,
      };

      if (context?.contextUri) {
        // Playing within a context (album/playlist)
        playOptions.context_uri = context.contextUri;
        playOptions.offset = { uri };
      } else if (context?.uris) {
        // Playing a list of tracks
        playOptions.uris = context.uris;
        playOptions.offset = { uri };
      } else {
        // Playing a single track
        playOptions.uris = [uri];
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playOptions),
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to start playback');
      }
    } catch (error) {
      console.error('Failed to start playback:', error);
      toast({
        title: "Playback Error",
        description: "Failed to start playback",
        variant: "destructive"
      });
    }
  };

  const pause = async () => {
    if (!player) return;
    try {
      await player.pause();
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  };

  const resume = async () => {
    if (!player) return;
    try {
      await player.resume();
    } catch (error) {
      console.error('Failed to resume:', error);
    }
  };

  const togglePlay = async () => {
    if (!player) return;
    try {
      if (state?.paused) {
        await resume();
      } else {
        await pause();
      }
    } catch (error) {
      console.error('Failed to toggle play state:', error);
    }
  };

  const nextTrack = async () => {
    if (!player) return;
    try {
      await player.nextTrack();
    } catch (error) {
      console.error('Failed to skip to next track:', error);
    }
  };

  const previousTrack = async () => {
    if (!player) return;
    try {
      await player.previousTrack();
    } catch (error) {
      console.error('Failed to skip to previous track:', error);
    }
  };

  const seek = async (position: number) => {
    if (!player) return;
    try {
      await player.seek(position);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  };

  const setVolume = async (volume: number) => {
    if (!player) return;
    try {
      await player.setVolume(volume);
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  };

  const getVolume = async () => {
    if (!player) return 0;
    try {
      return await player.getVolume();
    } catch (error) {
      console.error('Failed to get volume:', error);
      return 0;
    }
  };

  return (
    <PlaybackContext.Provider value={{
      player,
      deviceId,
      state,
      error,
      isActive,
      currentTrack,
      play,
      pause,
      resume,
      togglePlay,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      getVolume
    }}>
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
} 