
"use client";

import { useDashboard } from "./DashboardContext";
import type { DashboardStats } from "@/lib/api";
import KpiCards from "./kpi-cards";
import LeadConversionTrends from "./lead-conversion-trends";
import ProductPerformance from "./product-performance";
import AdvancedKpis from "./advanced-kpis";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const ClusterChart = dynamic(() => import("./cluster-chart"), { ssr: false });
const WinRateChart = dynamic(() => import("./win-rate-chart"), { ssr: false });
const PipelineValueChart = dynamic(() => import("./pipeline-value-chart"), { ssr: false });
const FunnelPerformance = dynamic(() => import("./funnel-performance"), { ssr: false });
const SalesByChannel = dynamic(() => import("./sales-by-channel"), { ssr: false });


export function DashboardLayout({ data }: { data: DashboardStats }) {
    const { enabledMetrics, setMetadataStatus } = useDashboard();

    useEffect(() => {
        setMetadataStatus(data.metadata?.status || 'ok');
    }, [data.metadata?.status, setMetadataStatus]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <KpiCards kpis={data.kpis} />
                </div>
                {enabledMetrics?.marketing_kpis && <AdvancedKpis data={data.extraKpis} />}
                {enabledMetrics?.lead_trend && <LeadConversionTrends data={data.leadConversion} />}
                {enabledMetrics?.cluster_view && <ClusterChart data={data.clusterData} />}
                {enabledMetrics?.win_rate_by_source && <WinRateChart data={data.winRateBySource} />}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
                {enabledMetrics?.sales_funnel && <FunnelPerformance data={data.funnelPerformance} />}
                {enabledMetrics?.pipeline_value && <PipelineValueChart data={data.pipelineValueByStage} />}
                {enabledMetrics?.product_performance && <ProductPerformance data={data.productPerformance} />}
                {enabledMetrics?.sales_by_channel && <SalesByChannel data={data.salesByChannel} />}
            </div>
        </div>
    );
}
