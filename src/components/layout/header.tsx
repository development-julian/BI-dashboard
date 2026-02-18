'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import DateRangeTabs from './date-range-tabs';
import { Skeleton } from '../ui/skeleton';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="font-headline text-xl font-semibold">
        Executive Overview
      </h1>
      <div className="ml-auto flex items-center gap-2">
        <Suspense fallback={<Skeleton className="hidden h-10 w-[180px] md:block" />}>
          <DateRangeTabs />
        </Suspense>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Code className="h-4 w-4" />
          <span className="sr-only">View Code</span>
        </Button>
      </div>
    </header>
  );
}
