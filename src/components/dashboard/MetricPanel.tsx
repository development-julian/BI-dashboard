"use client";

import { useDashboard } from "./DashboardContext";
import { metricRegistry, MetricDefinition } from "@/lib/metricRegistry";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Settings2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MetricPanel() {
    const { enabledMetrics, toggleMetric, metadataStatus } = useDashboard();
    const [isOpen, setIsOpen] = useState(false);

    const entries: MetricDefinition[] = Object.values(metricRegistry);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2 mb-6"
        >
            <div className="flex items-center justify-between space-x-4 px-4 py-3 bg-card border rounded-lg">
                <div className="flex items-center gap-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4" /> Edit Dashboard
                    </h4>
                    {metadataStatus === 'insufficient_data' && (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500 bg-yellow-500/10 text-[10px] uppercase">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Data Detected
                        </Badge>
                    )}
                </div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        {isOpen ? "Hide" : "Edit"}
                        <span className="sr-only">Toggle metrics</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Available Metrics</CardTitle>
                        <CardDescription>
                            Enable or disable widgets based on your needs. Metrics with high data requirements may be unreliable or disabled by default if volume is low.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {entries.map((metric) => {
                                const isEnabled = enabledMetrics[metric.id];
                                const isLowConfidence = metadataStatus === 'insufficient_data' && metric.minDataRequired > 5;

                                return (
                                    <div key={metric.id} className="flex items-center justify-between rounded-md border p-4">
                                        <div className="space-y-0.5">
                                            <h4 className="text-sm font-medium leading-none">{metric.label}</h4>
                                            <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
                                                Type: {metric.type.toUpperCase()}
                                                {isLowConfidence ? (
                                                    <span className="text-yellow-500 flex items-center ml-2 border-l pl-2 border-border" title="Needs more data">
                                                        <AlertTriangle className="h-3 w-3 mr-1" /> Low Vol
                                                    </span>
                                                ) : (
                                                    <span className="text-green-500 flex items-center ml-2 border-l pl-2 border-border" title="Healthy data volume">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Healthy
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={isEnabled}
                                            onCheckedChange={() => toggleMetric(metric.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    );
}
