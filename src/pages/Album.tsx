import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/spotify";
import { TrackRow } from "@/components/TrackRow";
import { Skeleton } from "@/components/ui/skeleton";
import { SpotifyTrack } from "@/types/spotify";
import { ErrorDisplay } from "@/components/ErrorDisplay";

interface SpotifyAlbum {
  id: string;
  uri: string;
  name: string;
  images: Array<{ url: string }>;
  artists: Array<{ id: string; name: string }>;
  release_date: string;
  total_tracks: number;
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

export function Album() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const { data: album, isLoading, error } = useQuery<SpotifyAlbum>({
    queryKey: ["album", id],
    queryFn: () => api.getAlbum(token!, id!),
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
        title="Couldn't Load Album"
        message="We're having trouble loading this album. Please try again later."
        action={{
          label: "Retry",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  if (!album) {
    return (
      <ErrorDisplay
        title="Album Not Found"
        message="We couldn't find this album. It might have been moved or removed."
      />
    );
  }

  const hasTracks = album.tracks?.items && album.tracks.items.length > 0;

  return (
    <div className="container py-6">
      <div className="flex items-start space-x-6 mb-6">
        <img
          src={album.images?.[0]?.url || '/placeholder-album.svg'}
          alt={album.name}
          className="w-48 h-48 object-cover rounded-md shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{album.name}</h1>
          <p className="text-muted-foreground mb-1">
            By {album.artists?.map(a => a.name).join(", ")}
          </p>
          <p className="text-sm text-muted-foreground">
            Released {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
          </p>
        </div>
      </div>

      {hasTracks ? (
        <div className="space-y-2">
          {album.tracks.items.map((track, index) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={index}
              contextUri={album.uri}
              tracks={album.tracks.items}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-4">
          No tracks available in this album
        </div>
      )}
    </div>
  );
}
