'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';

export function UserNav() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <div className="flex w-full items-center gap-2 p-2">
      <Avatar className="h-9 w-9">
        {userAvatar && (
          <AvatarImage
            src={userAvatar.imageUrl}
            alt="User avatar"
            width={40}
            height={40}
            data-ai-hint={userAvatar.imageHint}
          />
        )}
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
      <div className="hidden flex-col group-data-[collapsible=icon]:hidden">
        <p className="text-sm font-medium leading-none text-foreground">
          Andres Richards
        </p>
        <p className="text-xs leading-none text-muted-foreground">Owner</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden h-8 w-8 group-data-[collapsible=icon]:hidden"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Andres Richards</p>
              <p className="text-xs leading-none text-muted-foreground">
                andres@richards.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
