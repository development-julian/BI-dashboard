'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface SalesByChannelProps {
  data: { name: string; value: number }[];
}

const formatValue = (value: number) => {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
}


export default function SalesByChannel({ data }: SalesByChannelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sales by Channel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 0 }}>
            <XAxis 
              type="number"
              hide
             />
            <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={false}
                width={10}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value) => [`$${(value as number).toLocaleString()}`]}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              layout="vertical"
            >
                <LabelList dataKey="name" position="insideLeft" offset={10} className="fill-background font-semibold" fontSize={12} />
                 <LabelList 
                    dataKey="value" 
                    position="right" 
                    offset={10} 
                    className="fill-foreground font-bold" 
                    fontSize={14}
                    formatter={formatValue}
                 />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
