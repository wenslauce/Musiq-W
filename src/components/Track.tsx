import { usePlayback } from "@/contexts/PlaybackContext";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SpotifyTrack } from "@/types/spotify";

interface TrackProps {
  track: SpotifyTrack;
  index: number;
  showAlbum?: boolean;
  showArtwork?: boolean;
}

export function Track({ track, index, showAlbum = false, showArtwork = true }: TrackProps) {
  const { play, state } = usePlayback();
  const isPlaying = state?.track_window.current_track.id === track.id;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 hover:bg-muted/50 rounded-md cursor-pointer",
        isPlaying && "bg-muted"
      )}
      onClick={() => play(track.uri)}
    >
      <div className="w-8 text-center text-muted-foreground">{index + 1}</div>
      {showArtwork && (
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="h-12 w-12 rounded"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", isPlaying && "text-primary")}>
          {track.name}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {track.artists.map(artist => artist.name).join(", ")}
          {showAlbum && ` • ${track.album.name}`}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
} 