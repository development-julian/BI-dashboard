import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MousePointerClick, TrendingDown } from "lucide-react";

interface AdvancedKpisProps {
    data: {
        avgResponseTime: number;
        avgEngagement: number;
        cpa: number;
    }
}

export default function AdvancedKpis({ data }: AdvancedKpisProps) {
    if (!data) return null;

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-card to-secondary/10 border-indigo-500/20 shadow-sm shadow-indigo-500/10 transition-all hover:shadow-indigo-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-indigo-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">{data.avgResponseTime} <span className="text-sm font-medium text-muted-foreground">min</span></div>
                    <p className="text-xs text-muted-foreground mt-1">Average lead reply delay</p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-secondary/10 border-emerald-500/20 shadow-sm shadow-emerald-500/10 transition-all hover:shadow-emerald-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Lead Engagement</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">{data.avgEngagement} <span className="text-sm font-medium text-muted-foreground">score</span></div>
                    <p className="text-xs text-muted-foreground mt-1">Interaction quality</p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-secondary/10 border-orange-500/20 shadow-sm shadow-orange-500/10 transition-all hover:shadow-orange-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. CPA</CardTitle>
                    <TrendingDown className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">${data.cpa}</div>
                    <p className="text-xs text-muted-foreground mt-1">Cost Per Acquisition</p>
                </CardContent>
            </Card>
        </div>
    );
}
