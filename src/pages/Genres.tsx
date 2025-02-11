import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/spotify";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SpotifyCategory {
  id: string;
  name: string;
  icons: Array<{ url: string }>;
}

interface SpotifyCategories {
  categories: {
    items: SpotifyCategory[];
  };
}

export function Genres() {
  const { token } = useAuth();

  const { data: genres, isLoading, error } = useQuery<SpotifyCategories>({
    queryKey: ["genres"],
    queryFn: () => api.getGenres(token!),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-8">Genres & Moods</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="glass-card p-4">
              <Skeleton className="w-full aspect-square rounded-lg mb-4" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="text-destructive">Error loading genres: {error.toString()}</div>
      </div>
    );
  }

  const hasCategories = genres?.categories?.items && genres.categories.items.length > 0;

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-8">Genres & Moods</h1>
      {hasCategories ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {genres.categories.items.map((category) => (
            <Link
              key={category.id}
              to={`/genre/${category.id}`}
              className={cn(
                "glass-card p-4 group relative overflow-hidden",
                "hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              )}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src={category.icons?.[0]?.url || '/placeholder-playlist.svg'} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-center truncate">{category.name}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-8">
          No genres available
        </div>
      )}
    </div>
  );
}
