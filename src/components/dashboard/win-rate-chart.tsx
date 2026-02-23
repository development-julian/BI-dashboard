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

const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#F4A236', '#EA4335'];

export default function WinRateChart({ data }: { data: WinRateData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">Win Rate by Source</CardTitle>
                    <CardDescription>Conversion percentage of Leads to Won Deals</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                        No win rate data available yet. This chart requires won deals to populate.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatPercent = (value: number) => `${value}%`;

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
                            <Bar dataKey="win_rate" radius={[6, 6, 0, 0]}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
