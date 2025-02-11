import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SpotifyArtist } from "@/types/spotify";

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link to={`/artist/${artist.id}`}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="aspect-square rounded-full overflow-hidden mb-4">
            <img
              src={artist.images?.[0]?.url || '/placeholder-artist.svg'}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold truncate">{artist.name}</h3>
          <p className="text-sm text-muted-foreground">
            {artist.followers?.total?.toLocaleString() || 0} followers
          </p>
        </CardContent>
      </Card>
    </Link>
  );
} 