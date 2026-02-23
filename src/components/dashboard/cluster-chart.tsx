'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ZAxis
} from 'recharts';

interface ClusterData {
    id: string;
    x_engagement: number;
    y_value: number;
    category: string;
    status: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Facebook Ads': '#4285F4',
    'Google Ads': '#FBBC04',
    'Organic': '#34A853',
    'Direct': '#F4A236',
    'Email': '#EA4335',
    'Referral': '#A259FF',
};

const getColor = (category: string) => CATEGORY_COLORS[category] || '#60a5fa';

export default function ClusterChart({ data }: { data: ClusterData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">Engagement vs Value (Cluster)</CardTitle>
                    <CardDescription>Identifying high-value, high-engagement segments by source</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                        No cluster data available yet. This chart populates as lead engagement is tracked.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const categories = [...new Set(data.map(d => d.category))];
    const grouped = categories.map(cat => ({
        name: cat,
        data: data.filter(d => d.category === cat),
        fill: getColor(cat)
    }));

    const formatDollar = (val: number) => `$${val.toLocaleString()}`;

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Engagement vs Value (Cluster)</CardTitle>
                <CardDescription>Identifying high-value, high-engagement segments by source</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                type="number"
                                dataKey="x_engagement"
                                name="Engagement"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: '11px' }}
                                label={{ value: 'Engagement Score', position: 'insideBottom', offset: -10, style: { fill: 'hsl(var(--muted-foreground))', fontSize: '11px' } }}
                            />
                            <YAxis
                                type="number"
                                dataKey="y_value"
                                name="Value"
                                tickFormatter={formatDollar}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: '11px' }}
                                label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', offset: 5, style: { fill: 'hsl(var(--muted-foreground))', fontSize: '11px' } }}
                            />
                            <ZAxis range={[80, 200]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
                            />
                            {grouped.map((group) => (
                                <Scatter
                                    key={group.name}
                                    name={group.name}
                                    data={group.data}
                                    fill={group.fill}
                                    shape="circle"
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
