import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { api } from "@/lib/spotify";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { formatDuration } from "@/lib/utils";
import { SpotifyTrack, SpotifyArtist } from "@/types/spotify";

interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  release_date: string;
  total_tracks: number;
}

interface ArtistTopTracks {
  tracks: SpotifyTrack[];
}

interface ArtistAlbums {
  items: SpotifyAlbum[];
}

interface RelatedArtists {
  artists: SpotifyArtist[];
}

export function Artist() {
  const { id } = useParams();
  const { token } = useAuth();

  const { data: artist, isLoading: isLoadingArtist } = useQuery<SpotifyArtist>({
    queryKey: ["artist", id],
    queryFn: () => api.getArtist(token!, id!),
    enabled: !!token && !!id,
  });

  const { data: topTracks } = useQuery<ArtistTopTracks>({
    queryKey: ["artist-top-tracks", id],
    queryFn: () => api.getArtistTopTracks(token!, id!),
    enabled: !!token && !!id,
  });

  const { data: albums } = useQuery<ArtistAlbums>({
    queryKey: ["artist-albums", id],
    queryFn: () => api.getArtistAlbums(token!, id!),
    enabled: !!token && !!id,
  });

  const { data: relatedArtists } = useQuery<RelatedArtists>({
    queryKey: ["artist-related", id],
    queryFn: () => api.getRelatedArtists(token!, id!),
    enabled: !!token && !!id,
  });

  if (isLoadingArtist) return <div className="p-8">Loading...</div>;
  if (!artist) return null;

  const hasTopTracks = topTracks?.tracks && topTracks.tracks.length > 0;
  const hasAlbums = albums?.items && albums.items.length > 0;
  const hasRelatedArtists = relatedArtists?.artists && relatedArtists.artists.length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="relative h-[40vh] bg-gradient-to-b from-muted to-background">
        <div className="absolute inset-0 flex items-end p-8">
          <div>
            <h1 className="text-6xl font-bold mb-4">{artist.name}</h1>
            <p className="text-muted-foreground">
              {artist.followers?.total?.toLocaleString() || 0} followers
            </p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform mb-8">
          <Play className="w-8 h-8 text-primary-foreground" />
        </button>

        {/* Top Tracks */}
        {hasTopTracks && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular</h2>
            <div className="space-y-2">
              {topTracks.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center p-2 hover:bg-card rounded-lg group"
                >
                  <span className="w-8 text-muted-foreground">{index + 1}</span>
                  <img
                    src={track.album?.images?.[2]?.url || '/placeholder-album.svg'}
                    alt=""
                    className="w-10 h-10 rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {track.artists?.map(artist => artist.name).join(", ")}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(track.duration_ms)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums */}
        {hasAlbums && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {albums.items.map((album) => (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="spotify-card"
                >
                  <img
                    src={album.images?.[0]?.url || '/placeholder-album.svg'}
                    alt={album.name}
                    className="spotify-card-image"
                  />
                  <h3 className="font-semibold">{album.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {album.release_date?.split("-")[0]} • {album.total_tracks} songs
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Artists */}
        {hasRelatedArtists && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Fans Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedArtists.artists.map((artist) => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="spotify-card"
                >
                  <img
                    src={artist.images?.[0]?.url || '/placeholder-artist.svg'}
                    alt={artist.name}
                    className="spotify-card-image rounded-full"
                  />
                  <h3 className="font-semibold">{artist.name}</h3>
                  <p className="text-sm text-muted-foreground">Artist</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
