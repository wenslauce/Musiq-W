import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/spotify";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackRow } from "@/components/TrackRow";
import { ArtistCard } from "@/components/ArtistCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { SpotifyTrack, SpotifyArtist, SpotifyPlaylist } from "@/types/spotify";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResponse {
  tracks?: {
    items: SpotifyTrack[];
  };
  artists?: {
    items: SpotifyArtist[];
  };
  playlists?: {
    items: SpotifyPlaylist[];
  };
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();
  const query = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["search", debouncedQuery],
    queryFn: () => api.search(token!, debouncedQuery),
    enabled: !!token && !!debouncedQuery,
  });

  const tracks = data?.tracks?.items ?? [];
  const artists = data?.artists?.items ?? [];
  const playlists = data?.playlists?.items ?? [];

  const hasResults = tracks.length > 0 || artists.length > 0 || playlists.length > 0;

  return (
    <div className="container py-6">
      <Input
        type="search"
        placeholder="Search for tracks, artists, or playlists..."
        value={query}
        onChange={(e) => setSearchParams({ q: e.target.value })}
        className="mb-6"
      />

      {error ? (
        <div className="text-destructive">Error: {error.toString()}</div>
      ) : !debouncedQuery ? (
        <div className="text-muted-foreground text-center py-8">
          Start typing to search...
        </div>
      ) : !hasResults && !isLoading ? (
        <div className="text-muted-foreground text-center py-8">
          No results found for "{debouncedQuery}"
        </div>
      ) : (
        <Tabs defaultValue="tracks">
          <TabsList>
            <TabsTrigger value="tracks">
              Tracks {tracks.length ? `(${tracks.length})` : ''}
            </TabsTrigger>
            <TabsTrigger value="artists">
              Artists {artists.length ? `(${artists.length})` : ''}
            </TabsTrigger>
            <TabsTrigger value="playlists">
              Playlists {playlists.length ? `(${playlists.length})` : ''}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tracks.length > 0 ? (
              tracks.map((track, index) => (
                track && <TrackRow key={track.id} track={track} index={index} />
              ))
            ) : (
              <div className="text-muted-foreground text-center py-4">
                No tracks found
              </div>
            )}
          </TabsContent>

          <TabsContent value="artists">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton className="w-full aspect-square rounded-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                ))
              ) : artists.length > 0 ? (
                artists.map((artist) => (
                  artist && <ArtistCard key={artist.id} artist={artist} />
                ))
              ) : (
                <div className="col-span-full text-muted-foreground text-center py-4">
                  No artists found
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton className="w-full aspect-square rounded-md mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : playlists.length > 0 ? (
                playlists.map((playlist) => (
                  playlist && <PlaylistCard key={playlist.id} playlist={playlist} />
                ))
              ) : (
                <div className="col-span-full text-muted-foreground text-center py-4">
                  No playlists found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 