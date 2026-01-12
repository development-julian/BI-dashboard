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
            <p className="text-xs text-muted-foreground flex justify-between">
                <span>CONVERSION RATE</span>
                <span className='text-foreground'>Target: {data.conversionRateTarget}%</span>
            </p>
            <p className="text-2xl font-bold">{data.conversionRate}%</p>
            <Progress value={conversionPercentage} className='h-2 mt-2'/>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
