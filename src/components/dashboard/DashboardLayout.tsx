"use client";

import { useDashboard } from "./DashboardContext";
import type { DashboardStats } from "@/lib/api";
import KpiCards from "./kpi-cards";
import LeadConversionTrends from "./lead-conversion-trends";
import ProductPerformance from "./product-performance";
import AdvancedKpis from "./advanced-kpis";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// Dynamic imports with SSR disabled to prevent Recharts hydration errors
const ClusterChart = dynamic(() => import("./cluster-chart"), { ssr: false });
const WinRateChart = dynamic(() => import("./win-rate-chart"), { ssr: false });
const PipelineValueChart = dynamic(() => import("./pipeline-value-chart"), { ssr: false });
const FunnelPerformance = dynamic(() => import("./funnel-performance"), { ssr: false });

export function DashboardLayout({ data }: { data: DashboardStats }) {
    const { enabledMetrics, setMetadataStatus } = useDashboard();

    useEffect(() => {
        setMetadataStatus(data.metadata?.status || 'ok');
    }, [data.metadata?.status, setMetadataStatus]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {(enabledMetrics?.total_leads || enabledMetrics?.total_revenue || enabledMetrics?.conversion_rate) && (
                        <KpiCards kpis={data.kpis.filter(kpi =>
                            (kpi.label === 'CPL' && enabledMetrics?.total_leads) ||
                            (kpi.label === 'Ad Spend' && enabledMetrics?.total_revenue) ||
                            (kpi.label === 'ROAS' && enabledMetrics?.conversion_rate)
                        )} />
                    )}
                </div>
                {enabledMetrics?.marketing_kpis && <AdvancedKpis data={data.extraKpis} />}
                {enabledMetrics?.lead_trend && <LeadConversionTrends data={data.leadConversion} />}
                {enabledMetrics?.cluster_view && <ClusterChart data={data.clusterData} />}
                {enabledMetrics?.win_rate_by_source && <WinRateChart data={data.winRateBySource} />}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
                {enabledMetrics?.sales_funnel && <FunnelPerformance data={data.funnelPerformance} />}
                {enabledMetrics?.pipeline_value && <PipelineValueChart data={data.pipelineValueByStage} />}
                {enabledMetrics?.total_revenue && <ProductPerformance data={data.productPerformance} />}
            </div>
        </div>
    );
}
