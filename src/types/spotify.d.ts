interface Window {
  Spotify: {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }) => Spotify.Player;
  };
  onSpotifyWebPlaybackSDKReady: () => void;
}

declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: (evt: any) => void): boolean;
    removeListener(event: string, callback?: (evt: any) => void): boolean;
    getCurrentState(): Promise<WebPlaybackState | null>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }

  interface WebPlaybackTrack {
    uri: string;
    id: string | null;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: { url: string }[];
    };
    artists: { uri: string; name: string }[];
    duration_ms: number;
  }

  interface WebPlaybackState {
    context: {
      uri: string | null;
      metadata: Record<string, any> | null;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    duration: number;
    repeat_mode: 0 | 1 | 2;
    shuffle: boolean;
    track_window: {
      current_track: WebPlaybackTrack;
      previous_tracks: WebPlaybackTrack[];
      next_tracks: WebPlaybackTrack[];
    };
  }
}

declare namespace SpotifyApi {
  interface TrackObjectFull {
    id: string;
    uri: string;
    name: string;
    duration_ms: number;
    artists: ArtistObject[];
    album: AlbumObject;
  }

  interface ArtistObject {
    id: string;
    uri: string;
    name: string;
    images?: ImageObject[];
  }

  interface AlbumObject {
    id: string;
    uri: string;
    name: string;
    images: ImageObject[];
  }

  interface ImageObject {
    url: string;
    height: number;
    width: number;
  }

  interface PlaylistObject {
    id: string;
    uri: string;
    name: string;
    description: string;
    images: ImageObject[];
    owner: UserObject;
    tracks: {
      items: PlaylistTrackObject[];
      total: number;
    };
    followers: {
      total: number;
    };
  }

  interface PlaylistTrackObject {
    track: TrackObjectFull;
    added_at: string;
  }

  interface UserObject {
    id: string;
    display_name: string;
    images?: ImageObject[];
  }
} 