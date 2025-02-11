import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/spotify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaylistCard } from "@/components/PlaylistCard";
import { TrackRow } from "@/components/TrackRow";
import { ArtistCard } from "@/components/ArtistCard";
import { PlaylistsSkeleton } from "@/components/skeletons/PlaylistsSkeleton";
import { TracksSkeleton } from "@/components/skeletons/TracksSkeleton";
import { ArtistsSkeleton } from "@/components/skeletons/ArtistsSkeleton";
import { SpotifyPlaylist, SpotifyTrack, SpotifyArtist } from "@/types/spotify";

interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
}

interface SpotifyTopItemsResponse<T> {
  items: T[];
}

export function Library() {
  const { token } = useAuth();

  const { data: playlists, isLoading: isLoadingPlaylists, error: playlistsError } = useQuery<SpotifyPlaylistsResponse>({
    queryKey: ["user-playlists"],
    queryFn: () => api.getUserPlaylists(token!),
    enabled: !!token,
  });

  const { data: topTracks, isLoading: isLoadingTracks, error: tracksError } = useQuery<SpotifyTopItemsResponse<SpotifyTrack>>({
    queryKey: ["user-top-tracks"],
    queryFn: () => api.getTopTracks(token!),
    enabled: !!token,
  });

  const { data: topArtists, isLoading: isLoadingArtists, error: artistsError } = useQuery<SpotifyTopItemsResponse<SpotifyArtist>>({
    queryKey: ["user-top-artists"],
    queryFn: () => api.getTopArtists(token!),
    enabled: !!token,
  });

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>

      <Tabs defaultValue="playlists" className="space-y-6">
        <TabsList>
          <TabsTrigger value="playlists">
            Playlists {playlists?.total ? `(${playlists.total})` : ''}
          </TabsTrigger>
          <TabsTrigger value="tracks">
            Top Tracks {topTracks?.items?.length ? `(${topTracks.items.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="artists">
            Top Artists {topArtists?.items?.length ? `(${topArtists.items.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-4">
          {playlistsError ? (
            <div className="text-destructive">Error loading playlists: {playlistsError.toString()}</div>
          ) : isLoadingPlaylists ? (
            <PlaylistsSkeleton />
          ) : playlists?.items?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlists.items.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4">
              No playlists found
            </div>
          )}
        </TabsContent>

        <TabsContent value="tracks" className="space-y-4">
          {tracksError ? (
            <div className="text-destructive">Error loading tracks: {tracksError.toString()}</div>
          ) : isLoadingTracks ? (
            <TracksSkeleton />
          ) : topTracks?.items?.length ? (
            <div className="space-y-2">
              {topTracks.items.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4">
              No top tracks found
            </div>
          )}
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          {artistsError ? (
            <div className="text-destructive">Error loading artists: {artistsError.toString()}</div>
          ) : isLoadingArtists ? (
            <ArtistsSkeleton />
          ) : topArtists?.items?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {topArtists.items.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4">
              No top artists found
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 