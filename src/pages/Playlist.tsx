import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/spotify";
import { TrackRow } from "@/components/TrackRow";
import { Skeleton } from "@/components/ui/skeleton";
import { SpotifyPlaylist, SpotifyTrack } from "@/types/spotify";
import { ErrorDisplay } from "@/components/ErrorDisplay";

interface PlaylistResponse extends SpotifyPlaylist {
  uri: string;
  tracks: {
    items: Array<{
      track: SpotifyTrack;
      added_at: string;
    }>;
    total: number;
  };
}

export function Playlist() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const { data: playlist, isLoading, error } = useQuery<PlaylistResponse>({
    queryKey: ["playlist", id],
    queryFn: () => api.getPlaylist(token!, id!),
    enabled: !!token && !!id,
  });

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex items-start space-x-6 mb-6">
          <Skeleton className="w-48 h-48" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <Skeleton className="h-12 w-12" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Couldn't Load Playlist"
        message="We're having trouble loading this playlist. Please try again later."
        action={{
          label: "Retry",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  if (!playlist) {
    return (
      <ErrorDisplay
        title="Playlist Not Found"
        message="We couldn't find this playlist. It might have been moved or removed."
      />
    );
  }

  const hasTracks = playlist.tracks?.items && playlist.tracks.items.length > 0;
  const tracks = playlist.tracks.items.map(item => item.track);

  return (
    <div className="container py-6">
      <div className="flex items-start space-x-6 mb-6">
        <img
          src={playlist.images?.[0]?.url || '/placeholder-playlist.svg'}
          alt={playlist.name}
          className="w-48 h-48 object-cover rounded-md shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-muted-foreground mb-1">{playlist.description}</p>
          <p className="text-sm text-muted-foreground">
            By {playlist.owner.display_name} • {playlist.tracks.total} tracks
          </p>
        </div>
      </div>

      {hasTracks ? (
        <div className="space-y-2">
          {playlist.tracks.items.map(({ track }, index) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={index}
              contextUri={playlist.uri}
              tracks={tracks}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-4">
          No tracks available in this playlist
        </div>
      )}
    </div>
  );
}
