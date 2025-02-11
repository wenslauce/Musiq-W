import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SpotifyPlaylist } from "@/types/spotify";

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link to={`/playlist/${playlist.id}`}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
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
    </Link>
  );
} 