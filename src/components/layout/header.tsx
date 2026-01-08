'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { usePathname } from 'next/navigation';

function getTitleFromPathname(pathname: string): string {
  const segment = pathname.split('/').pop() || 'dashboard';
  if (segment === 'ai-suggestions') return 'AI Suggestions';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function AppHeader() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="font-headline text-xl font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
