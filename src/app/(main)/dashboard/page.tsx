
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardContent from '@/components/dashboard/dashboard-content';


function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-[140px] w-full" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
           <Skeleton className="h-[400px] w-full" />
           <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
