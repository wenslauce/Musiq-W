import { Button } from "@/components/ui/button";
import { loginUrl } from "@/lib/spotify";

export function LoginButton() {
  return (
    <Button 
      onClick={() => window.location.href = loginUrl}
      className="bg-spotify hover:bg-spotify/90"
    >
      Login with Spotify
    </Button>
  );
} 