'use client';

import { useState, useEffect } from 'react';
import type { MarketingData } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ResponsiveContainer,
    Pie,
    Cell,
    Tooltip,
    PieChart,
} from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function ChannelBreakdownChart({ data }: { data: MarketingData['channelBreakdown']}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalSpend = data.reduce((acc, item) => acc + item.spend, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Channel Spend</CardTitle>
                <CardDescription>How the budget is allocated across channels.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--secondary))' }}
                                contentStyle={{
                                    background: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="spend"
                                nameKey="channel"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs fill-muted-foreground">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div className="font-bold flex justify-between">
                        <span>Total Spend:</span>
                        <span>{isClient ? `$${totalSpend.toLocaleString()}` : '...'}</span>
                    </div>
                    <ul className="space-y-1">
                        {data.map((item, index) => (
                            <li key={item.channel} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-muted-foreground">{item.channel}</span>
                                </div>
                                <span className="font-medium">{isClient ? `$${item.spend.toLocaleString()}` : '...'}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
