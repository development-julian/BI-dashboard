'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '@/lib/api';

import AiForecast from '@/components/dashboard/ai-forecast';
import KpiCards from '@/components/dashboard/kpi-cards';
import LeadConversionTrends from '@/components/dashboard/lead-conversion-trends';
import FunnelPerformance from '@/components/dashboard/funnel-performance';
import SalesByChannel from '@/components/dashboard/sales-by-channel';
import ProductPerformance from '@/components/dashboard/product-performance';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dashboardData = await getDashboardStats();
      setData(dashboardData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !data) {
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
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
             <Skeleton className="h-[400px] w-full" />
             <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AiForecast />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <KpiCards kpis={data.kpis} />
          </div>
          <LeadConversionTrends data={data.leadConversion} />
          <SalesByChannel data={data.salesByChannel} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <FunnelPerformance data={data.funnelPerformance} />
          <ProductPerformance data={data.productPerformance} />
        </div>
      </div>
    </div>
  );
}
