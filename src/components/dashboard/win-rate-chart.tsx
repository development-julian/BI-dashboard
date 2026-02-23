'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface WinRateData {
    source: string;
    win_rate: number;
    total_revenue: number;
    roi: number;
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function WinRateChart({ data }: { data: WinRateData[] }) {
    if (!data || data.length === 0) return null;

    const formatPercent = (value: number) => value + '%';

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Win Rate by Source</CardTitle>
                <CardDescription>Conversion percentage of Leads to Won Deals</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="source" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: '12px' }} />
                            <YAxis unit="%" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                formatter={(value: number) => [formatPercent(value), 'Win Rate']}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="win_rate" radius={[4, 4, 0, 0]}>
                                {data.map((_, index) => (
                                    <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
