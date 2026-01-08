'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Home, LineChart, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/details', icon: LineChart, label: 'Details' },
  { href: '/suggestions', icon: Bot, label: 'AI Suggestions' },
  { href: '/settings', icon: Settings, label: 'Settings' },
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
          <Logo className="size-6 text-primary" />
          <span className="font-headline text-lg font-semibold text-foreground">InsightBoard</span>
        </Link>
      </SidebarHeader>
      <Separator className="bg-border" />
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
