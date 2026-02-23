// Node 1: Mock Data
const pipelines = [
    {
        id: "pipeline_1",
        stages: [
            { id: "stage_1", name: "New Lead", order: 1 },
            { id: "stage_2", name: "Contacted", order: 2 },
            { id: "stage_3", name: "Qualified", order: 3 },
            { id: "stage_4", name: "Proposal", order: 4 },
            { id: "stage_5", name: "Won", order: 5 }
        ]
    }
];

const opportunities = [
    { id: "opp_1", pipelineStageId: "stage_1", status: "open", monetaryValue: 500, source: "Facebook Ads", engagementScore: 20, responseTimeMinutes: 120 },
    { id: "opp_2", pipelineStageId: "stage_5", status: "won", monetaryValue: 1200, source: "Google Ads", engagementScore: 90, responseTimeMinutes: 5 },
    { id: "opp_3", pipelineStageId: "stage_2", status: "open", monetaryValue: 300, source: "Organic", engagementScore: 40, responseTimeMinutes: 45 },
    { id: "opp_4", pipelineStageId: "stage_5", status: "won", monetaryValue: 800, source: "Organic", engagementScore: 85, responseTimeMinutes: 10 },
    { id: "opp_5", pipelineStageId: "stage_3", status: "open", monetaryValue: 1500, source: "Facebook Ads", engagementScore: 60, responseTimeMinutes: 30 },
    { id: "opp_6", pipelineStageId: "stage_4", status: "open", monetaryValue: 2000, source: "Google Ads", engagementScore: 75, responseTimeMinutes: 15 },
    { id: "opp_7", pipelineStageId: "stage_1", status: "lost", monetaryValue: 400, source: "Facebook Ads", engagementScore: 10, responseTimeMinutes: 300 }
];

const marketingSpend = {
    "Facebook Ads": 500,
    "Google Ads": 600,
    "Organic": 0
};

let data = { pipelines, opportunities, marketingSpend };

// Node 2: Funnel
const funnelMap = {};
pipelines[0].stages.forEach(s => funnelMap[s.id] = { name: s.name, count: 0, order: s.order });
opportunities.forEach(o => {
    if (funnelMap[o.pipelineStageId]) funnelMap[o.pipelineStageId].count += 1;
});
const sales_funnel = Object.values(funnelMap).sort((a, b) => a.order - b.order).map(stage => ({
    stage: stage.name,
    count: stage.count
}));
data.charts = { sales_funnel };

// Node 3: Cluster
data.charts.cluster_data = opportunities.map(o => ({
    id: o.id,
    x_engagement: o.engagementScore || 0,
    y_value: o.monetaryValue || 0,
    category: o.source,
    status: o.status
}));

// Node 4: Metrics
let totalResponseTime = 0;
const sourceStats = {};
const valueByStage = {};
let totalEngagement = 0;

opportunities.forEach(o => {
    totalResponseTime += o.responseTimeMinutes || 0;
    totalEngagement += o.engagementScore || 0;

    if (!sourceStats[o.source]) sourceStats[o.source] = { leads: 0, won: 0, value: 0 };
    sourceStats[o.source].leads += 1;
    if (o.status === "won") {
        sourceStats[o.source].won += 1;
        sourceStats[o.source].value += o.monetaryValue || 0;
    }

    const stageName = pipelines[0].stages.find(s => s.id === o.pipelineStageId)?.name || o.pipelineStageId;
    valueByStage[stageName] = (valueByStage[stageName] || 0) + (o.monetaryValue || 0);
});

const numOpps = opportunities.length || 1;
data.additional_kpis = {
    avg_response_time_mins: parseFloat((totalResponseTime / numOpps).toFixed(2)),
    avg_engagement_score: parseFloat((totalEngagement / numOpps).toFixed(2)),
    overall_cpa: parseFloat(((500 + 600) / 2).toFixed(2)) // 1100 spend / 2 won
};

data.charts.win_rate_by_source = Object.keys(sourceStats).map(src => {
    const snt = sourceStats[src];
    const spendVal = marketingSpend[src] || 0;
    const win_rate = snt.leads > 0 ? (snt.won / snt.leads) * 100 : 0;
    const roi = spendVal > 0 ? ((snt.value - spendVal) / spendVal) * 100 : (snt.value > 0 ? 100 : 0);
    return {
        source: src,
        win_rate: parseFloat(win_rate.toFixed(2)),
        total_revenue: snt.value,
        roi: parseFloat(roi.toFixed(2))
    };
});

data.charts.pipeline_value_by_stage = Object.keys(valueByStage).map(st => ({
    stage: st,
    value: valueByStage[st]
}));

// Node 5: Output
const finalOutput = {
    kpis: {
        total_leads: opportunities.length,
        total_revenue: data.charts.win_rate_by_source.reduce((sum, item) => sum + item.total_revenue, 0),
        avg_response_time: data.additional_kpis.avg_response_time_mins,
        avg_engagement: data.additional_kpis.avg_engagement_score,
        cpa: data.additional_kpis.overall_cpa
    },
    charts: data.charts,
    metadata: {
        total_records_processed: opportunities.length,
        status: "success"
    }
};

const fs = require('fs');
fs.writeFileSync('test_schema.json', JSON.stringify(finalOutput, null, 2));
console.log("Validation Successful. Output saved to test_schema.json.");
