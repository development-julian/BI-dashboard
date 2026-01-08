
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/dashboard/data-table';
import { tableData, lineChartData } from '@/lib/data';
import UserActivityLineChart from '@/components/dashboard/line-chart';

export default function DetailsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">User Activity</CardTitle>
          <CardDescription>A detailed look at user engagement across platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserActivityLineChart data={lineChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
          <CardDescription>
            A list of recent transactions from the last 10 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}
