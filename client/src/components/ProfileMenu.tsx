import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@shared/schema";

export function ProfileMenu() {
  const { user, isLoading } = useAuth() as { user: User | null; isLoading: boolean };

  if (isLoading || !user) {
    return null;
  }

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name?.[0]?.toUpperCase())
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full cursor-pointer" data-testid="button-profile-menu">
          <Avatar className="h-8 w-8">
            {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.firstName || "User"} />}
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/api/logout" className="cursor-pointer flex items-center gap-2" data-testid="button-logout">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
