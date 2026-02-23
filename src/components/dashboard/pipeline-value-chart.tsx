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

const COLORS = ['#eab308', '#f97316', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function PipelineValueChart({ data }: { data: PipelineValueData[] }) {
    if (!data || data.length === 0) return null;

    const formatDollar = (val: number) => '$' + val;

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
                                formatter={(value: number) => ['$' + value, 'Value']}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
