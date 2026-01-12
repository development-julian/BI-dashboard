'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AreaChart,
  Bot,
  Box,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Separator } from '../ui/separator';
import { UserNav } from './user-nav';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/marketing', icon: AreaChart, label: 'Marketing Perf.' },
  { href: '/inventory', icon: Box, label: 'Sales & Inventory' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="group-data-[variant=sidebar]:bg-sidebar group-data-[variant=sidebar]:text-sidebar-foreground"
    >
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="size-7 text-primary" />
          <span className="font-headline text-xl font-semibold text-foreground">
            NexusDash
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                  className="aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>UPCOMING FEATURES</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                     <SidebarMenuButton tooltip={{children: "AI Copilot"}} disabled>
                        <Bot />
                        <span>AI Copilot</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
