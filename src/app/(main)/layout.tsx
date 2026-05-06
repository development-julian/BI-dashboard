import AppHeader from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen w-full">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
