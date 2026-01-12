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
          <BarChart data={data} layout="horizontal" margin={{ left: -20, right: 20, top: 5, bottom: 20 }}>
            <XAxis 
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
             />
            <YAxis
             hide
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
              barSize={80}
            >
                <LabelList dataKey="name" position="bottom" offset={25} className="fill-muted-foreground font-semibold" fontSize={12} />
                 <LabelList 
                    dataKey="value" 
                    position="bottom" 
                    offset={5} 
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
