import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/spotify";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SpotifyPlaylist } from "@/types/spotify";

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: newReleases } = useQuery({
    queryKey: ["new-releases"],
    queryFn: () => api.getNewReleases(token!),
    enabled: !!token,
  });

  const { data: playlists, isLoading, isError, error } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      try {
        // Try to get featured playlists first
        const response = await api.getFeaturedPlaylists(token!);
        return response.playlists.items;
      } catch (error) {
        // Fall back to user's playlists
        const userResponse = await api.getCurrentUser(token!);
        const playlistsResponse = await fetch(
          `https://api.spotify.com/v1/users/${userResponse.id}/playlists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await playlistsResponse.json();
        return data.items;
      }
    },
    enabled: !!token,
  });

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => api.getGenres(token!),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Featured Playlists</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="group cursor-pointer transition-shadow hover:shadow-lg">
              <CardContent className="p-4">
                <Skeleton className="w-full aspect-square rounded-md mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-6">
        <div className="p-4 text-center">
          <p className="text-lg text-red-500">
            Error loading playlists: {(error as Error).message}
          </p>
        </div>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="container py-6">
        <div className="p-4 text-center">
          <p className="text-lg text-muted-foreground">No playlists found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      {/* New Releases */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {newReleases?.albums?.items?.map((album: any) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="spotify-card"
            >
              <img
                src={album.images[0].url}
                alt={album.name}
                className="spotify-card-image"
              />
              <h3 className="font-semibold">{album.name}</h3>
              <p className="text-sm text-muted-foreground">
                {album.artists.map((artist: any) => artist.name).join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist: SpotifyPlaylist) => (
            <Card 
              key={playlist.id}
              className="group cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              <CardContent className="p-4">
                <div className="aspect-square rounded-md overflow-hidden mb-4">
                  <img
                    src={playlist.images?.[0]?.url || '/placeholder-playlist.png'}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold truncate">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {playlist.description || `By ${playlist.owner.display_name}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Browse Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Browse All</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {genres?.categories?.items?.map((category: any) => (
            <Link
              key={category.id}
              to={`/genre/${category.id}`}
              className="spotify-card"
            >
              <img
                src={category.icons[0].url}
                alt={category.name}
                className="spotify-card-image"
              />
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 