'use client';

import { Funnel, FunnelChart, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import type { FunnelStage } from '@/lib/api';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function SalesFunnel({ data }: { data: FunnelStage[] }) {
  return (
    <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Funnel
                    dataKey="count"
                    data={data}
                    isAnimationActive
                    lastShapeType="rectangle"
                >
                    <LabelList 
                        position="center" 
                        fill="#fff" 
                        stroke="none" 
                        dataKey="name" 
                        className='font-semibold'
                    />
                </Funnel>
            </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}