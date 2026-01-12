import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Compass, 
  Users, 
  LogOut, 
  User,
  Plus
} from "lucide-react";
import { CreateCommunityModal } from "./CreateCommunityModal";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-card border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
            R
          </div>
          <span className="hidden lg:block font-display font-bold text-xl tracking-tight">Rlly Fans</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-2 mt-4">
        <NavItem href="/home" icon={Home} label="Home" active={isActive("/home")} />
        <NavItem href="/discover" icon={Compass} label="Discover" active={isActive("/discover")} />
        <NavItem href="/my-communities" icon={Users} label="My Communities" active={isActive("/my-communities")} />
        <NavItem href="/profile" icon={User} label="Profile" active={isActive("/profile")} />
      </nav>

      {/* Action / User */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="hidden lg:block">
          <CreateCommunityModal />
        </div>
        <div className="lg:hidden flex justify-center">
           <Button size="icon" className="rounded-full bg-primary"><Plus className="w-5 h-5" /></Button>
        </div>

        {user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/30 border border-white/5">
            <Avatar className="w-10 h-10 border border-white/10">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <button 
                onClick={() => logout()}
                className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link href={href} className={`
      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
      ${active 
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }
    `}>
      <Icon className={`w-5 h-5 ${active ? "animate-pulse-slow" : "group-hover:scale-110 transition-transform"}`} />
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
}
