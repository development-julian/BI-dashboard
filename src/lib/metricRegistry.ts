export interface MetricDefinition {
    id: string;
    label: string;
    type: 'kpi' | 'chart';
    minDataRequired: number;
    category: 'sales' | 'marketing' | 'inventory';
    chartComponent?: string;
    defaultVisible: boolean;
}

export const metricRegistry: Record<string, MetricDefinition> = {
    total_leads: {
        id: "total_leads",
        label: "Total Leads",
        type: "kpi",
        minDataRequired: 0,
        category: "sales",
        defaultVisible: true
    },
    conversion_rate: {
        id: "conversion_rate",
        label: "Conversion Rate",
        type: "kpi",
        minDataRequired: 1,
        category: "sales",
        defaultVisible: true
    },
    total_revenue: {
        id: "total_revenue",
        label: "Total Revenue",
        type: "kpi",
        minDataRequired: 0,
        category: "sales",
        defaultVisible: true
    },
    average_ticket: {
        id: "average_ticket",
        label: "Average Ticket",
        type: "kpi",
        minDataRequired: 5,
        category: "sales",
        defaultVisible: false
    },
    lead_trend: {
        id: "lead_trend",
        label: "Lead Conversion Trend",
        type: "chart",
        minDataRequired: 20,
        category: "sales",
        chartComponent: "LineChart",
        defaultVisible: false
    },
    sales_funnel: {
        id: "sales_funnel",
        label: "Sales Funnel",
        type: "chart",
        minDataRequired: 1,
        category: "sales",
        chartComponent: "BarChart",
        defaultVisible: false
    },
    cluster_view: {
        id: "cluster_view",
        label: "Engagement vs Value (Cluster)",
        type: "chart",
        minDataRequired: 5,
        category: "marketing",
        chartComponent: "ScatterChart",
        defaultVisible: false
    },
    win_rate_by_source: {
        id: "win_rate_by_source",
        label: "Win Rate by Lead Source",
        type: "chart",
        minDataRequired: 5,
        category: "marketing",
        chartComponent: "BarChart",
        defaultVisible: false
    },
    pipeline_value: {
        id: "pipeline_value",
        label: "Pipeline Value by Stage",
        type: "chart",
        minDataRequired: 1,
        category: "sales",
        chartComponent: "BarChart",
        defaultVisible: false
    },
    marketing_kpis: {
        id: "marketing_kpis",
        label: "Advanced Marketing KPIs",
        type: "kpi",
        minDataRequired: 1,
        category: "marketing",
        defaultVisible: false
    }
};
