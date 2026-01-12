'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import type { DashboardStats } from '@/lib/api';
import { Progress } from '../ui/progress';

interface LeadConversionTrendsProps {
  data: DashboardStats['leadConversion'];
}

export default function LeadConversionTrends({ data }: LeadConversionTrendsProps) {
  const conversionPercentage = (data.conversionRate / data.conversionRateTarget) * 100;
  
  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
            <div>
                <CardTitle className="font-headline">Lead Conversion Trends</CardTitle>
                <CardDescription>Daily lead volume and quality analysis</CardDescription>
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
            <p className="text-2xl font-bold">{data.totalLeads.toLocaleString()}</p>
            <p className="text-xs font-semibold text-green-500">{data.totalLeadsChange}</p>
          </div>
          <div className='p-4 rounded-lg bg-card-foreground/5'>
            <p className="text-xs text-muted-foreground">MARKETING QUALIFIED (MQL)</p>
            <p className="text-2xl font-bold">{data.mql.toLocaleString()}</p>
            <p className="text-xs font-semibold text-green-500">{data.mqlChange}</p>
          </div>
          <div className='p-4 rounded-lg bg-card-foreground/5'>
            <p className="text-xs text-muted-foreground">CONVERSION RATE</p>
            <p className="text-2xl font-bold">{data.conversionRate}%</p>
            <div className="relative mt-2 pt-2">
              <Progress value={conversionPercentage} className='h-2'/>
              <div className="text-xs text-muted-foreground text-right mt-1">
                Target: {data.conversionRateTarget}%
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
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
