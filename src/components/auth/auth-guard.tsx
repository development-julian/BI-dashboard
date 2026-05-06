'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps any subtree that requires authentication.
 * Redirects unauthenticated users to /login.
 * Shows nothing while the session is being hydrated from localStorage.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Don't flash the protected content while hydrating
  if (isLoading || !user) return null;

  return <>{children}</>;
}
