import { useState, useEffect } from "react";
import { usePlayback } from "@/contexts/PlaybackContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { FullScreenPlayer } from "@/components/player/FullScreenPlayer";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2
} from "lucide-react";

export function NowPlaying() {
  const {
    state,
    togglePlay,
    previousTrack,
    nextTrack,
    seek,
    setVolume,
    getVolume
  } = usePlayback();

  const [volume, setVolumeState] = useState<number>(0.5);
  const [position, setPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  // Update position for progress bar
  useEffect(() => {
    if (!state || isDragging) return;

    const interval = setInterval(() => {
      setPosition((prev: number) => {
        if (state.paused) return prev;
        return prev + 1000;
      });
    }, 1000);

    setPosition(state.position);

    return () => clearInterval(interval);
  }, [state, isDragging]);

  // Sync volume with player
  useEffect(() => {
    getVolume().then(setVolumeState);
  }, [getVolume]);

  if (!state?.track_window.current_track) {
    return null;
  }

  const currentTrack = state.track_window.current_track;

  const handleSeek = async (value: number[]) => {
    setPosition(value[0]);
    setIsDragging(false);
    await seek(value[0]);
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    await setVolume(newVolume);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const mobileContent = (
    <div className="fixed bottom-[4.5rem] left-0 right-0 bg-background/80 backdrop-blur-lg border-t">
      <div className="container py-4 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={currentTrack.album.images[0]?.url}
            alt=""
            className="w-16 h-16 rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {currentTrack.artists.map((artist: { name: string }) => artist.name).join(", ")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTime(position)}</span>
            <Slider
              value={[position]}
              min={0}
              max={state.duration}
              step={1000}
              onValueChange={value => {
                setPosition(value[0]);
                setIsDragging(true);
              }}
              onValueCommit={handleSeek}
              className="flex-1"
            />
            <span>{formatTime(state.duration)}</span>
          </div>

          <div className="flex justify-center items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                state.shuffle && "text-primary"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={previousTrack}
              disabled={state.disallows.skipping_prev}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={togglePlay}
            >
              {state.paused ? (
                <Play className="h-5 w-5 ml-0.5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={nextTrack}
              disabled={state.disallows.skipping_next}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                state.repeat_mode > 0 && "text-primary"
              )}
            >
              {state.repeat_mode === 2 ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const desktopContent = (
    <div className="container flex items-center h-20 gap-4">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-[30%]">
        <div 
          className="relative group cursor-pointer"
          onClick={() => setShowFullScreen(true)}
        >
          <img
            src={currentTrack.album.images[0]?.url}
            alt=""
            className="w-14 h-14 rounded"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
            <Maximize2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{currentTrack.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {currentTrack.artists.map((artist: { name: string }) => artist.name).join(", ")}
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              state.shuffle && "text-primary"
            )}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={previousTrack}
            disabled={state.disallows.skipping_prev}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={togglePlay}
          >
            {state.paused ? (
              <Play className="h-4 w-4 ml-0.5" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={nextTrack}
            disabled={state.disallows.skipping_next}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              state.repeat_mode > 0 && "text-primary"
            )}
          >
            {state.repeat_mode === 2 ? (
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(position)}
          </span>
          <Slider
            value={[position]}
            min={0}
            max={state.duration}
            step={1000}
            onValueChange={value => {
              setPosition(value[0]);
              setIsDragging(true);
            }}
            onValueCommit={handleSeek}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(state.duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="w-[30%] flex justify-end items-center gap-2">
        <VolumeIcon className="h-4 w-4" />
        <Slider
          value={[volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {mobileContent}
        <div 
          className="fixed bottom-[4.5rem] left-0 right-0 bg-background/80 backdrop-blur-lg border-t cursor-pointer"
          onClick={() => setShowFullScreen(true)}
        >
          <div className="container py-2 flex items-center gap-4">
            <img
              src={currentTrack.album.images[0]?.url}
              alt=""
              className="w-12 h-12 rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{currentTrack.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack.artists.map((artist: { name: string }) => artist.name).join(", ")}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {state.paused ? (
                <Play className="h-4 w-4 ml-0.5" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullScreen(true);
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t">
        {desktopContent}
      </div>
      {showFullScreen && (
        <FullScreenPlayer onClose={() => setShowFullScreen(false)} />
      )}
    </>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
