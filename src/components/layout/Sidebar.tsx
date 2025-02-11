import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-60 glass-effect h-full flex flex-col hidden md:flex">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold spotify-text-gradient">Musiq Wave</span>
        </Link>
        <nav className="mt-8 space-y-6">
          <div className="space-y-3">
            <NavLink to="/" icon={Home} label="Home" active={isActive("/")} />
            <NavLink to="/search" icon={Search} label="Search" active={isActive("/search")} />
            <NavLink to="/library" icon={Library} label="Your Library" active={isActive("/library")} />
          </div>
          <div className="space-y-3">
            <button className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition-colors w-full">
              <Plus className="w-6 h-6" />
              <span className="font-medium">Create Playlist</span>
            </button>
            <button className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition-colors w-full">
              <Heart className="w-6 h-6" />
              <span className="font-medium">Liked Songs</span>
            </button>
          </div>
        </nav>
      </div>
      <div className="mt-auto p-6">
        <div className="text-xs space-y-2 text-muted-foreground">
          <p className="hover:text-foreground transition-colors cursor-pointer">Legal</p>
          <p className="hover:text-foreground transition-colors cursor-pointer">Privacy Center</p>
          <p className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</p>
          <p className="hover:text-foreground transition-colors cursor-pointer">Cookies</p>
          <p className="hover:text-foreground transition-colors cursor-pointer">About Ads</p>
        </div>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

function NavLink({ to, icon: Icon, label, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-4 transition-colors",
        "text-muted-foreground hover:text-foreground",
        active && "text-primary"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
