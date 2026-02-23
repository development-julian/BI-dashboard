'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import type { DashboardStats } from '@/lib/api';
import { Progress } from '../ui/progress';

interface LeadConversionTrendsProps {
  data: DashboardStats['leadConversion'];
}

// Define data volume thresholds
const VOLUME_THRESHOLDS = {
  LOW: 20,
  MEDIUM: 100,
};

export default function LeadConversionTrends({ data }: LeadConversionTrendsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const conversionPercentage = data.conversionRateTarget > 0 ? (data.conversionRate / data.conversionRateTarget) * 100 : 0;

  const dataPoints = data.chartData.length;
  let chartType: 'bar' | 'area' = 'area';

  // Dynamic Chart Selection based on data volume
  if (dataPoints <= VOLUME_THRESHOLDS.LOW) {
    chartType = 'bar';
  }

  // Dynamic properties for Area chart
  const areaChartProps = {
    dot: dataPoints > 0 && dataPoints <= VOLUME_THRESHOLDS.MEDIUM
      ? { r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))', strokeWidth: 2 }
      : false,
    strokeWidth: 2,
  };


  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className="font-headline flex items-center gap-2">
              Lead Conversion Trends
              {data.status === 'insufficient_data' && (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500 bg-yellow-500/10 ml-2">
                  Low Volume (Need 20+)
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {data.status === 'insufficient_data'
                ? "Displaying against target baseline due to insufficient data."
                : "Daily lead volume and quality analysis"}
            </CardDescription>
          </div>
          <Badge variant="secondary" className='bg-green-500/10 text-green-400 border-green-500/20'>
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            Live Updates
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className='p-4 rounded-lg bg-card-foreground/5'>
            <p className="text-xs text-muted-foreground">TOTAL LEADS</p>
            <p className="text-2xl font-bold">{isClient ? data.totalLeads.toLocaleString() : '...'}</p>
            <p className="text-xs font-semibold text-green-500">{data.totalLeadsChange}</p>
          </div>
          <div className='p-4 rounded-lg bg-card-foreground/5'>
            <p className="text-xs text-muted-foreground">MARKETING QUALIFIED (MQL)</p>
            <p className="text-2xl font-bold">{isClient ? data.mql.toLocaleString() : '...'}</p>
            <p className="text-xs font-semibold text-green-500">{data.mqlChange}</p>
          </div>
          <div className='p-4 rounded-lg bg-card-foreground/5'>
            <p className="text-xs text-muted-foreground">CONVERSION RATE</p>
            <p className="text-2xl font-bold">{data.conversionRate}%</p>
            <div className="relative mt-2 pt-2">
              <Progress value={conversionPercentage} className='h-2' />
              <div className="text-xs text-muted-foreground text-right mt-1">
                Target: {data.conversionRateTarget}%
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            {chartType === 'bar' ? (
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  hide
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            ) : (
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  hide
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />

                {/* Static Background Graph / Target Baseline Overlay */}
                {data.status === 'insufficient_data' && (
                  <Area
                    type="monotone"
                    dataKey="baselineTarget"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    fill="url(#colorBaseline)"
                    strokeWidth={1}
                    name="Target Baseline"
                    isAnimationActive={false}
                  />
                )}

                {/* Actual Data Graph */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorValue)"
                  name="Actual Leads"
                  {...areaChartProps}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-4">
            <span className='font-bold text-foreground'>QUALITY SCORE BREAKDOWN:</span>
            <div className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-green-500'></span>
              <span>High (45%)</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-blue-500'></span>
              <span>Med (35%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
