import { usePlayback } from "@/contexts/PlaybackContext";
import { formatDuration, cn } from "@/lib/utils";
import { SpotifyTrack } from "@/types/spotify";
import { Link } from "react-router-dom";

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
  contextUri?: string;  // URI of the album/playlist
  tracks?: SpotifyTrack[];  // List of all tracks in the context
}

export function TrackRow({ track, index, contextUri, tracks }: TrackRowProps) {
  const { play, state } = usePlayback();
  const isPlaying = state?.track_window.current_track.id === track.id;

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (contextUri) {
      // Play within album/playlist context
      await play(track.uri, { contextUri });
    } else if (tracks) {
      // Play within a list of tracks
      const trackUris = tracks.map(t => t.uri);
      await play(track.uri, { uris: trackUris });
    } else {
      // Play single track
      await play(track.uri);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-4 p-2 hover:bg-muted/50 rounded-md cursor-pointer",
        isPlaying && "bg-muted"
      )}
      onClick={handlePlay}
    >
      <div className="w-8 text-center text-muted-foreground">{index + 1}</div>
      <img
        src={track.album?.images?.[0]?.url || '/placeholder-album.svg'}
        alt={track.name}
        className="h-12 w-12 rounded"
      />
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", isPlaying && "text-primary")}>
          {track.name}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {track.artists?.map((artist, i) => (
            <span key={artist.id}>
              {i > 0 && ", "}
              <Link
                to={`/artist/${artist.id}`}
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {artist.name}
              </Link>
            </span>
          ))}
          {track.album && (
            <>
              <span className="mx-1">•</span>
              <Link
                to={`/album/${track.album.id}`}
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {track.album.name}
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
} 