'use client';

import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';

function initials(name: string): string {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function UserNav() {
  const { user, logout } = useAuth();

  const displayName = user?.username ?? 'Usuario';
  const displayEmail = user?.email ?? '';
  const displayRole = user?.role ?? '';
  const avatarInitials = initials(displayName);

  return (
    <div className="flex w-full items-center gap-2 p-2">
      <Avatar className="h-9 w-9">
        <AvatarFallback>{avatarInitials}</AvatarFallback>
      </Avatar>

      <div className="hidden flex-col group-data-[collapsible=icon]:hidden" style={{ display: 'flex' }}>
        <p className="text-sm font-medium leading-none text-foreground">{displayName}</p>
        {displayRole && (
          <p className="text-xs leading-none text-muted-foreground capitalize">{displayRole}</p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden h-8 w-8 group-data-[collapsible=icon]:hidden"
            style={{ display: 'flex' }}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              {displayEmail && (
                <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            id="logout-btn"
            onClick={logout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
