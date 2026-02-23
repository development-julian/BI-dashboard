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

interface PipelineValueData {
    stage: string;
    value: number;
}

const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#F4A236', '#EA4335'];

export default function PipelineValueChart({ data }: { data: PipelineValueData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">Pipeline Value</CardTitle>
                    <CardDescription>Monetary valuation grouped by current stage</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
                        No pipeline value data available yet. This chart requires deal values to populate.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatDollar = (val: number) => `$${val.toLocaleString()}`;

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Pipeline Value</CardTitle>
                <CardDescription>Monetary valuation grouped by current stage</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: '12px' }} />
                            <YAxis tickFormatter={formatDollar} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                formatter={(value: number) => [formatDollar(value), 'Value']}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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
