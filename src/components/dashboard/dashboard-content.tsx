import { getDashboardStats, type DashboardStats, N8N_WEBHOOK_URL } from '@/lib/api';

import AiForecast from '@/components/dashboard/ai-forecast';
import KpiCards from '@/components/dashboard/kpi-cards';
import LeadConversionTrends from '@/components/dashboard/lead-conversion-trends';
import FunnelPerformance from '@/components/dashboard/funnel-performance';
import SalesByChannel from '@/components/dashboard/sales-by-channel';
import ProductPerformance from '@/components/dashboard/product-performance';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function DashboardContent({ dateRange }: { dateRange: string }) {
  const result = await getDashboardStats(dateRange);

  if (!result || (result && 'error' in result)) {
    const error = result || { message: "Could not load dashboard data.", type: 'Unknown' };
    return (
      <div className="flex h-[50vh] items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: {error.type}</AlertTitle>
          <AlertDescription>
            {error.message}
            <div className="mt-2 text-xs">
                <strong>URL Webhook:</strong> <code>{N8N_WEBHOOK_URL}</code>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const data = result as DashboardStats;

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
