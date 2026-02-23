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
    Cell,
} from 'recharts';

interface ClusterData {
    id: string;
    x_engagement: number;
    y_value: number;
    category: string;
    status: string;
}

const COLORS: Record<string, string> = {
    'Facebook Ads': '#1877F2',
    'Google Ads': '#DB4437',
    'Organic': '#0F9D58',
    'Direct': '#F4B400'
};

export default function ClusterChart({ data }: { data: ClusterData[] }) {
    if (!data || data.length === 0) {
        return null;
    }

    const formatDollar = (val: number) => '$' + val;

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Engagement vs Value (Cluster)</CardTitle>
                <CardDescription>Identifying high-value, high-engagement segments by source</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                type="number"
                                dataKey="x_engagement"
                                name="Engagement Score"
                                domain={[0, 100]}
                                tick={{ fill: 'hsl(var(--foreground))', fontSize: '12px' }}
                                label={{ value: 'Engagement Score', position: 'insideBottom', offset: -10, fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                type="number"
                                dataKey="y_value"
                                name="Pipeline Value"
                                tick={{ fill: 'hsl(var(--foreground))', fontSize: '12px' }}
                                label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={formatDollar}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            />
                            <Scatter name="Opportunities" data={data} fill="#8884d8">
                                {data.map((entry, index) => (
                                    <Cell key={'cell-' + index} fill={COLORS[entry.category] || '#8884d8'} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#1877F2]"></span> Facebook Ads</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#DB4437]"></span> Google Ads</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#0F9D58]"></span> Organic</div>
                </div>
            </CardContent>
        </Card>
    );
}
