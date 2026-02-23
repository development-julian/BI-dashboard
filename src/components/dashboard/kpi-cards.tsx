'use client';
import { Card } from '@/components/ui/card';
import { DollarSign, Percent, User, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KpiCard as KpiCardType } from '@/lib/api';
import { useDashboard } from './DashboardContext';

const iconMap = {
  dollar: DollarSign,
  percent: Percent,
  user: User,
};

const labelToMetricId: Record<string, string> = {
    'Total Revenue': 'total_revenue',
    'Total Leads': 'total_leads',
    'Conversion Rate': 'conversion_rate',
};

interface KpiCardsProps {
    kpis: KpiCardType[];
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  const { enabledMetrics } = useDashboard();

  const visibleKpis = kpis.filter(kpi => {
      const metricId = labelToMetricId[kpi.label];
      // If a metric is not in our toggleable list, always show it.
      // Otherwise, check if it's enabled.
      return !metricId || enabledMetrics[metricId];
  });

  return (
    <>
      {visibleKpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </>
  );
}

function KpiCard({ label, value, change, changeType, icon }: KpiCardType) {
  const Icon = iconMap[icon];
  const isIncrease = changeType === 'increase';

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <span
          className={cn(
            'flex items-center text-xs font-semibold',
            isIncrease ? 'text-green-500' : 'text-red-500'
          )}
        >
          {isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change}
        </span>
      </div>
    </Card>
  );
}
