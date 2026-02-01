
import { getMarketingData, type MarketingData } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    ResponsiveContainer,
    Pie,
    Cell,
    Tooltip,
} from 'recharts';

const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    paused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    ended: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function CampaignPerformanceTable({ data }: { data: MarketingData['campaignPerformance'] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Detailed breakdown of all active and past campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead className="text-right">Spend</TableHead>
                            <TableHead className="text-right">CPC</TableHead>
                            <TableHead className="text-right">Conversions</TableHead>
                            <TableHead className="text-right">ROAS</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((campaign) => (
                            <TableRow key={campaign.id}>
                                <TableCell className="font-medium">{campaign.name}</TableCell>
                                <TableCell className="text-right">${campaign.spend.toLocaleString()}</TableCell>
                                <TableCell className="text-right">${campaign.cpc.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{campaign.conversions}</TableCell>
                                <TableCell className="text-right">{campaign.roas}x</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={cn("capitalize", statusColors[campaign.status])}>
                                        {campaign.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

function ChannelBreakdownChart({ data }: { data: MarketingData['channelBreakdown']}) {
    const totalSpend = data.reduce((acc, item) => acc + item.spend, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Channel Spend</CardTitle>
                <CardDescription>How the budget is allocated across channels.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--secondary))' }}
                                contentStyle={{
                                    background: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="spend"
                                nameKey="channel"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs fill-muted-foreground">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div className="font-bold flex justify-between">
                        <span>Total Spend:</span>
                        <span>${totalSpend.toLocaleString()}</span>
                    </div>
                    <ul className="space-y-1">
                        {data.map((item, index) => (
                            <li key={item.channel} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-muted-foreground">{item.channel}</span>
                                </div>
                                <span className="font-medium">${item.spend.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

export default async function MarketingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const range = typeof searchParams?.range === 'string' ? searchParams.range : '30d';
  const result = await getMarketingData(range);

  if (!result || (result && 'error' in result)) {
    const error = result || { message: "Could not load marketing data.", type: 'Unknown' };
    return (
      <div className="flex h-[50vh] items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: {error.type}</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
                 <ChannelBreakdownChart data={result.channelBreakdown} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp /> Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Summary of campaign performance highlights will be displayed here once connected to AI insights.</p>
                    </CardContent>
                 </Card>
            </div>
        </div>
        <CampaignPerformanceTable data={result.campaignPerformance} />
    </div>
  );
}
