import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button 
      variant="ghost" 
      onClick={logout}
      className="text-muted-foreground hover:text-foreground"
    >
      Logout
    </Button>
  );
} 