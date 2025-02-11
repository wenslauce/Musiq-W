import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/spotify";
import { PlaylistCard } from "@/components/PlaylistCard";
import { TrackRow } from "@/components/TrackRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistsSkeleton } from "@/components/skeletons/PlaylistsSkeleton";
import { TracksSkeleton } from "@/components/skeletons/TracksSkeleton";
import { SpotifyPlaylist, SpotifyTrack } from "@/types/spotify";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useNavigate } from "react-router-dom";

interface GenreDetails {
  id: string;
  name: string;
  icons: Array<{ url: string }>;
}

interface GenrePlaylists {
  playlists: {
    items: SpotifyPlaylist[];
  };
}

interface GenreRecommendations {
  tracks: SpotifyTrack[];
}

export default function Genre() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: genre, isLoading: isLoadingGenre, error: genreError } = useQuery<GenreDetails>({
    queryKey: ["genre", id],
    queryFn: () => api.getGenreDetails(token!, id!),
    enabled: !!token && !!id,
  });

  const { data: playlists, isLoading: isLoadingPlaylists, error: playlistsError } = useQuery<GenrePlaylists>({
    queryKey: ["genre-playlists", id],
    queryFn: () => api.getGenrePlaylists(token!, id!),
    enabled: !!token && !!id,
  });

  const { data: recommendations, isLoading: isLoadingRecommendations, error: recommendationsError } = useQuery<GenreRecommendations>({
    queryKey: ["genre-recommendations", id],
    queryFn: () => api.getRecommendationsByGenre(token!, id!),
    enabled: !!token && !!id,
  });

  if (isLoadingGenre) {
    return (
      <div className="container py-6">
        <div className="flex items-start space-x-6 mb-8">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (genreError) {
    return (
      <ErrorDisplay
        title="Genre Not Found"
        message="We couldn't find this genre. It might have been moved or removed."
        action={{
          label: "Browse All Genres",
          onClick: () => navigate("/genres")
        }}
      />
    );
  }

  if (!genre) {
    return (
      <ErrorDisplay
        title="Unable to Load Genre"
        message="We're having trouble loading this genre's information. Please try again later."
        action={{
          label: "Try Again",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  // Safely extract the playlist items and tracks with default empty arrays
  const playlistItems = playlists?.playlists?.items ?? [];
  const recommendedTracks = recommendations?.tracks ?? [];

  // Check if we have any items
  const hasPlaylists = playlistItems.length > 0;
  const hasRecommendations = recommendedTracks.length > 0;

  return (
    <div className="container py-6">
      <div className="flex items-start space-x-6 mb-8">
        <img
          src={genre.icons?.[0]?.url || '/placeholder-playlist.svg'}
          alt={genre.name}
          className="h-32 w-32 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{genre.name}</h1>
          <p className="text-muted-foreground">
            Explore {genre.name} music
          </p>
        </div>
      </div>

      <Tabs defaultValue="playlists" className="space-y-6">
        <TabsList>
          <TabsTrigger value="playlists">
            Featured Playlists {hasPlaylists && `(${playlistItems.length})`}
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            Recommended Tracks {hasRecommendations && `(${recommendedTracks.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-4">
          {playlistsError ? (
            <ErrorDisplay
              title="Couldn't Load Playlists"
              message="We're having trouble loading the playlists. Please try again later."
              action={{
                label: "Retry",
                onClick: () => window.location.reload()
              }}
            />
          ) : isLoadingPlaylists ? (
            <PlaylistsSkeleton />
          ) : hasPlaylists ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlistItems.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4">
              No playlists available for this genre yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendationsError ? (
            <ErrorDisplay
              title="Couldn't Load Recommendations"
              message="We're having trouble loading the recommended tracks. Please try again later."
              action={{
                label: "Retry",
                onClick: () => window.location.reload()
              }}
            />
          ) : isLoadingRecommendations ? (
            <TracksSkeleton />
          ) : hasRecommendations ? (
            <div className="space-y-2">
              {recommendedTracks.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4">
              No recommended tracks available for this genre yet
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 