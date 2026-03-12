'use client';

import { useState, useEffect, useMemo } from 'react';
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import type { DashboardStats } from '@/lib/api';
import { Progress } from '../ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LeadConversionTrendsProps {
  data: DashboardStats['leadConversion'];
}

// Generate distinct colors for channels based on predefined sequence
const COLORS = [
  'hsl(var(--primary))',
  '#10b981', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export default function LeadConversionTrends({ data }: LeadConversionTrendsProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('All');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const conversionPercentage = data.conversionRateTarget > 0 ? (data.conversionRate / data.conversionRateTarget) * 100 : 0;

  // Extract unique channels from data
  const channels = useMemo(() => {
    const channelSet = new Set<string>();
    data.chartData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date' && key !== 'baselineTarget' && key !== 'value') {
          channelSet.add(key);
        }
      });
    });
    return Array.from(channelSet);
  }, [data.chartData]);

  // Handle fallback where data comes as 'value' (from missing Excel or standard data)
  const isFallback = channels.length === 0 && data.chartData.length > 0 && data.chartData[0].value !== undefined;
  if (isFallback) {
    channels.push('value');
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className="font-headline flex items-center gap-2">
              Leads Conversion Trends
              {data.status === 'insufficient_data' && (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500 bg-yellow-500/10 ml-2">
                  Low Volume (Need 20+)
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {data.status === 'insufficient_data'
                ? "Displaying against target baseline due to insufficient data."
                : "Monthly total sales breakdown by channel"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {channels.length > 0 && !isFallback && (
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Channels</SelectItem>
                  {channels.map((ch) => (
                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Badge variant="secondary" className='bg-green-500/10 text-green-400 border-green-500/20'>
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Live Updates
            </Badge>
          </div>
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
            <LineChart data={data.chartData}>
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
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />

              {/* Render lines dynamically based on selected channel */}
              {channels.map((channel, idx) => {
                if (selectedChannel !== 'All' && selectedChannel !== channel) return null;

                return (
                  <Line
                    key={channel}
                    type="monotone"
                    dataKey={channel}
                    name={isFallback ? "Leads" : channel}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={selectedChannel === 'All' ? 2 : 3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )
              })}
            </LineChart>
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
