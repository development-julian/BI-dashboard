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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Importamos Alert
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Nuevo estado para error

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dashboardData = await getDashboardStats();
      if (!dashboardData) {
        setError(true);
      } else {
        setData(dashboardData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 1. Estado de Carga
  if (loading) {
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
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
             <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Estado de Error (Si la API falla)
  if (error || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Conexión</AlertTitle>
          <AlertDescription>
            No pudimos conectar con n8n. Verifica que el Webhook esté activo y la URL sea correcta en <code>src/lib/api.ts</code>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 3. Estado de Éxito
  return (
    <div className="flex flex-col gap-6">
      <AiForecast 
        title={data.aiForecast?.title} 
        description={data.aiForecast?.description} 
        sentiment={data.aiForecast?.sentiment}
      />

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