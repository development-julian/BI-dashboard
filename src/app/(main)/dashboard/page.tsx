'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/dashboard/metric-card';
import { getDashboardData, getAnalysisData, type DashboardData, type AnalysisData } from '@/lib/api';
import { Activity, CreditCard, DollarSign, Users, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import OverviewBarChart from '@/components/dashboard/bar-chart';
import UserActivityLineChart from '@/components/dashboard/line-chart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AiInsightCard from '@/components/dashboard/ai-insight-card';

const iconMap = {
  'Total Revenue': DollarSign,
  'Subscriptions': Users,
  'Sales': CreditCard,
  'Active Now': Activity,
  'default': DollarSign
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getDashboardData();
      if (result.success && result.data) {
        setDashboardData(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to load dashboard data.",
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAnalyze = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    const result = await getAnalysisData();
    if (result.success && result.data) {
      setAnalysisData(result.data);
    } else {
      setAnalysisError(result.message || "Failed to load AI analysis.");
    }
    setAnalysisLoading(false);
  };

  const barChart = dashboardData?.charts.find(c => c.chartType === 'bar');
  const lineChart = dashboardData?.charts.find(c => c.chartType === 'line');

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
              const Icon = iconMap[kpi.title as keyof typeof iconMap] || iconMap.default;
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
        {loading || !barChart ? (
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="pl-2">
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-headline">{barChart.title}</CardTitle>
              {barChart.description && <CardDescription>{barChart.description}</CardDescription>}
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewBarChart data={barChart.data} />
            </CardContent>
          </Card>
        )}
        
        {loading || !lineChart ? (
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">{lineChart.title}</CardTitle>
              {lineChart.description && <CardDescription>{lineChart.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <UserActivityLineChart data={lineChart.data} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-center">
          <Button onClick={handleAnalyze} disabled={analysisLoading || !!analysisData}>
              <Bot className="mr-2" />
              {analysisLoading ? 'Analyzing...' : analysisData ? 'Analysis Complete' : 'Analyze with AI'}
          </Button>
      </div>

      {(analysisLoading || analysisData || analysisError) && (
        <AiInsightCard 
          loading={analysisLoading}
          report={analysisData?.intelligenceReport}
          error={analysisError}
        />
      )}
    </div>
  );
}
