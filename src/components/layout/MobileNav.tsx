import { Link } from "react-router-dom";
import { Home, Search, Library, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t">
      <div className="container flex items-center justify-around py-2">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/search" icon={Search} label="Search" />
        <NavItem to="/library" icon={Library} label="Library" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  const isActive = window.location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 p-2",
        "text-muted-foreground hover:text-foreground transition-colors",
        isActive && "text-primary"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
} 