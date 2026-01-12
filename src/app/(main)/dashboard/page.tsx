'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/dashboard/metric-card';
import { getDashboardData, type DashboardData } from '@/lib/api';
import {
  Users,
  Target,
  DollarSign,
  LineChart as LineChartIcon,
  Bot,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import OverviewBarChart from '@/components/dashboard/bar-chart';
import PerformanceLineChart from '@/components/dashboard/line-chart';
import { Button } from '@/components/ui/button';
import SourcePieChart from '@/components/dashboard/pie-chart';
import SalesFunnel from '@/components/dashboard/sales-funnel';

const iconMap = {
  'Leads Generated': Users,
  'Conversion Rate': Target,
  'Pipeline Value': DollarSign,
  'Revenue': LineChartIcon,
  default: DollarSign,
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const lineChart = dashboardData?.charts.find((c) => c.chartType === 'line');
  const barChart = dashboardData?.charts.find((c) => c.chartType === 'bar');
  const pieChart = dashboardData?.charts.find((c) => c.chartType === 'pie');

  return (
    <div className="flex flex-col gap-8">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/4" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        dashboardData && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {dashboardData.kpis.map((kpi) => {
              const Icon =
                iconMap[kpi.title as keyof typeof iconMap] || iconMap.default;
              return (
                <MetricCard
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType}
                  Icon={Icon}
                />
              );
            })}
          </div>
        )
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-5">
        {loading || !lineChart ? (
          <Card className="lg:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="pl-2">
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">{lineChart.title}</CardTitle>
              {lineChart.description && (
                <CardDescription>{lineChart.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pl-2">
              <PerformanceLineChart data={lineChart.data} />
            </CardContent>
          </Card>
        )}

        {loading || !barChart ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">{barChart.title}</CardTitle>
              {barChart.description && (
                <CardDescription>{barChart.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <OverviewBarChart data={barChart.data} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-5">
        {loading || !dashboardData?.funnel ? (
           <Card className="lg:col-span-3">
             <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
           </Card>
        ) : (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">Sales Funnel</CardTitle>
              <CardDescription>
                Visual representation of your sales pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesFunnel data={dashboardData.funnel} />
            </CardContent>
          </Card>
        )}
        
        {loading || !pieChart ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
             <CardHeader>
              <CardTitle className="font-headline">{pieChart.title}</CardTitle>
              {pieChart.description && (
                <CardDescription>{pieChart.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <SourcePieChart data={pieChart.data} />
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot /> AI Actions
          </CardTitle>
          <CardDescription>
            Unlock deeper insights and predictive analytics. (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
            <Button variant="outline" disabled>AI Insights</Button>
            <Button variant="outline" disabled>Predict Conversions</Button>
            <Button variant="outline" disabled>Optimize Funnel</Button>
        </CardContent>
      </Card>
    </div>
  );
}