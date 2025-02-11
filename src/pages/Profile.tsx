import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/spotify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaylistsSkeleton } from "@/components/skeletons/PlaylistsSkeleton";
import { TracksSkeleton } from "@/components/skeletons/TracksSkeleton";
import { ArtistsSkeleton } from "@/components/skeletons/ArtistsSkeleton";
import { PlaylistCard } from "@/components/PlaylistCard";
import { TrackRow } from "@/components/TrackRow";
import { ArtistCard } from "@/components/ArtistCard";
import { SpotifyUser, SpotifyPlaylist, SpotifyTrack, SpotifyArtist } from "@/types/spotify";

interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
}

interface SpotifyTopItemsResponse<T> {
  items: T[];
}

export function Profile() {
  const { token } = useAuth();

  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery<SpotifyUser>({
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser(token!),
    enabled: !!token,
  });

  const { data: playlists, isLoading: isLoadingPlaylists, error: playlistsError } = useQuery<SpotifyPlaylistsResponse>({
    queryKey: ["playlists"],
    queryFn: () => api.getUserPlaylists(token!),
    enabled: !!token,
  });

  const { data: topTracks, isLoading: isLoadingTracks, error: tracksError } = useQuery<SpotifyTopItemsResponse<SpotifyTrack>>({
    queryKey: ["top-tracks"],
    queryFn: () => api.getTopTracks(token!),
    enabled: !!token,
  });

  const { data: topArtists, isLoading: isLoadingArtists, error: artistsError } = useQuery<SpotifyTopItemsResponse<SpotifyArtist>>({
    queryKey: ["top-artists"],
    queryFn: () => api.getTopArtists(token!),
    enabled: !!token,
  });

  if (isLoadingUser) {
    return (
      <div className="container py-6">
        <div className="flex items-start space-x-6 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="container py-6">
        <div className="text-destructive">Error loading profile: {userError.toString()}</div>
      </div>
    );
  }

  if (!user) return null;

  const hasPlaylists = playlists?.items && playlists.items.length > 0;
  const hasTopTracks = topTracks?.items && topTracks.items.length > 0;
  const hasTopArtists = topArtists?.items && topArtists.items.length > 0;

  return (
    <div className="container py-6">
      <div className="flex items-start space-x-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.images?.[0]?.url} />
          <AvatarFallback>
            {user.display_name?.charAt(0) || user.id.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.display_name}</h1>
          <p className="text-muted-foreground">
            {playlists?.total || 0} Public Playlists • {user.followers?.total || 0} Followers
          </p>
        </div>
      </div>

      <Tabs defaultValue="playlists" className="space-y-6">
        <TabsList>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="top-tracks">Top Tracks</TabsTrigger>
          <TabsTrigger value="top-artists">Top Artists</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-4">
          {playlistsError ? (
            <div className="text-destructive">Error loading playlists: {playlistsError.toString()}</div>
          ) : isLoadingPlaylists ? (
            <PlaylistsSkeleton />
          ) : hasPlaylists ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlists.items.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No playlists found</div>
          )}
        </TabsContent>

        <TabsContent value="top-tracks" className="space-y-4">
          {tracksError ? (
            <div className="text-destructive">Error loading top tracks: {tracksError.toString()}</div>
          ) : isLoadingTracks ? (
            <TracksSkeleton />
          ) : hasTopTracks ? (
            <div className="space-y-2">
              {topTracks.items.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No top tracks found</div>
          )}
        </TabsContent>

        <TabsContent value="top-artists" className="space-y-4">
          {artistsError ? (
            <div className="text-destructive">Error loading top artists: {artistsError.toString()}</div>
          ) : isLoadingArtists ? (
            <ArtistsSkeleton />
          ) : hasTopArtists ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {topArtists.items.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No top artists found</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 