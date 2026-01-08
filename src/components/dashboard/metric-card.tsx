import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  Icon: LucideIcon;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType,
  Icon,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={cn(
            'text-xs text-muted-foreground',
            changeType === 'increase'
              ? 'text-green-600'
              : 'text-red-600'
          )}
        >
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
