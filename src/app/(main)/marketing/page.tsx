
import { getMarketingData, type MarketingData, N8N_WEBHOOK_URL } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ChannelBreakdownChart from '@/components/marketing/channel-breakdown-chart';

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
            <div className="mt-2 text-xs">
                <strong>URL Webhook:</strong> <code>{N8N_WEBHOOK_URL}</code>
            </div>
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
