import MetricCard from '@/components/dashboard/metric-card';
import { kpiData } from '@/lib/data';
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import OverviewBarChart from '@/components/dashboard/bar-chart';
import UserActivityLineChart from '@/components/dashboard/line-chart';

const iconMap = {
  'Total Revenue': DollarSign,
  Subscriptions: Users,
  Sales: CreditCard,
  'Active Now': Activity,
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <MetricCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType as 'increase' | 'decrease'}
            description={kpi.description}
            Icon={iconMap[kpi.title as keyof typeof iconMap]}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewBarChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">User Activity</CardTitle>
            <CardDescription>Desktop vs. Mobile Users</CardDescription>
          </CardHeader>
          <CardContent>
            <UserActivityLineChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
