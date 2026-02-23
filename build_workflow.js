const fs = require('fs');

try {
    const originalData = fs.readFileSync('ghl_workflow.json', 'utf8');
    const originalWorkflow = JSON.parse(originalData);

    const triggerNode = originalWorkflow.nodes.find(n => n.name === 'When Executed by Another Workflow');

    const mockDataNode = {
        "parameters": {
            "jsCode": `return [
  {
    json: {
      pipelines: [
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
      ],
      opportunities: [
        { id: "opp_1", pipelineStageId: "stage_1", status: "open", monetaryValue: 500, source: "Facebook Ads", engagementScore: 20, responseTimeMinutes: 120 },
        { id: "opp_2", pipelineStageId: "stage_5", status: "won", monetaryValue: 1200, source: "Google Ads", engagementScore: 90, responseTimeMinutes: 5 },
        { id: "opp_3", pipelineStageId: "stage_2", status: "open", monetaryValue: 300, source: "Organic", engagementScore: 40, responseTimeMinutes: 45 },
        { id: "opp_4", pipelineStageId: "stage_5", status: "won", monetaryValue: 800, source: "Organic", engagementScore: 85, responseTimeMinutes: 10 },
        { id: "opp_5", pipelineStageId: "stage_3", status: "open", monetaryValue: 1500, source: "Facebook Ads", engagementScore: 60, responseTimeMinutes: 30 },
        { id: "opp_6", pipelineStageId: "stage_4", status: "open", monetaryValue: 2000, source: "Google Ads", engagementScore: 75, responseTimeMinutes: 15 },
        { id: "opp_7", pipelineStageId: "stage_1", status: "lost", monetaryValue: 400, source: "Facebook Ads", engagementScore: 10, responseTimeMinutes: 300 }
      ],
      marketingSpend: {
        "Facebook Ads": 500,
        "Google Ads": 600,
        "Organic": 0
      }
    }
  }
];`
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [500, 400],
        "id": "node-mock-data",
        "name": "Mock GHL API Response"
    };

    const funnelNode = {
        "parameters": {
            "jsCode": `const data = $input.first().json;
const pipelines = data.pipelines[0].stages;
const opps = data.opportunities;

const funnelMap = {};
pipelines.forEach(s => funnelMap[s.id] = { name: s.name, count: 0, order: s.order });

opps.forEach(o => {
  if(funnelMap[o.pipelineStageId]) {
    funnelMap[o.pipelineStageId].count += 1;
  }
});

const sales_funnel = Object.values(funnelMap).sort((a,b) => a.order - b.order).map(stage => {
  return {
    stage: stage.name,
    count: stage.count
  };
});

// Create charts object if not exist
if (!data.charts) data.charts = {};
data.charts.sales_funnel = sales_funnel;

return [{ json: data }];`
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [700, 400],
        "id": "node-funnel",
        "name": "Funnel Transformation"
    };

    const clusterNode = {
        "parameters": {
            "jsCode": `const data = $input.first().json;
const opps = data.opportunities;

const cluster_data = opps.map(o => ({
  id: o.id,
  x_engagement: o.engagementScore || 0,
  y_value: o.monetaryValue || 0,
  category: o.source,
  status: o.status
}));

data.charts.cluster_data = cluster_data;
return [{ json: data }];`
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [900, 400],
        "id": "node-cluster",
        "name": "Data Isolation & Clustering"
    };

    const metricsNode = {
        "parameters": {
            "jsCode": `const data = $input.first().json;
const opps = data.opportunities;
const spend = data.marketingSpend || {};

let totalResponseTime = 0;
const sourceStats = {};
const valueByStage = {};
let totalEngagement = 0;

opps.forEach(o => {
  totalResponseTime += o.responseTimeMinutes || 0;
  totalEngagement += o.engagementScore || 0;
  
  if(!sourceStats[o.source]) sourceStats[o.source] = { leads: 0, won: 0, value: 0 };
  sourceStats[o.source].leads += 1;
  if(o.status === "won") {
    sourceStats[o.source].won += 1;
    sourceStats[o.source].value += o.monetaryValue || 0;
  }
  
  const stageName = data.pipelines[0].stages.find(s => s.id === o.pipelineStageId)?.name || o.pipelineStageId;
  valueByStage[stageName] = (valueByStage[stageName] || 0) + (o.monetaryValue || 0);
});

const numOpps = opps.length || 1;
const avgResponseTime = totalResponseTime / numOpps;
const avgEngagement = totalEngagement / numOpps;

let totalSpend = Object.values(spend).reduce((a,b) => a+b, 0);
let totalWon = opps.filter(o => o.status === 'won').length;
const cpa = totalWon > 0 ? totalSpend / totalWon : 0;

data.additional_kpis = {
  avg_response_time_mins: parseFloat(avgResponseTime.toFixed(2)),
  avg_engagement_score: parseFloat(avgEngagement.toFixed(2)),
  overall_cpa: parseFloat(cpa.toFixed(2))
};

data.charts.win_rate_by_source = Object.keys(sourceStats).map(src => {
  const snt = sourceStats[src];
  const spendVal = spend[src] || 0;
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

return [{ json: data }];`
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [1100, 400],
        "id": "node-metrics",
        "name": "Additional Marketing Metrics"
    };

    const outputNode = {
        "parameters": {
            "jsCode": `const data = $input.first().json;

const finalOutput = {
  kpis: {
    total_leads: data.opportunities.length,
    total_revenue: data.charts.win_rate_by_source.reduce((sum, item) => sum + item.total_revenue, 0),
    avg_response_time: data.additional_kpis.avg_response_time_mins,
    avg_engagement: data.additional_kpis.avg_engagement_score,
    cpa: data.additional_kpis.overall_cpa
  },
  charts: data.charts,
  metadata: {
    total_records_processed: data.opportunities.length,
    status: "success"
  }
};

return [{ json: { payload: finalOutput } }];`
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [1300, 400],
        "id": "node-output",
        "name": "Output Formatter"
    };

    originalWorkflow.nodes = [
        triggerNode,
        mockDataNode,
        funnelNode,
        clusterNode,
        metricsNode,
        outputNode
    ];

    originalWorkflow.connections = {
        "When Executed by Another Workflow": {
            "main": [[{ "node": "Mock GHL API Response", "type": "main", "index": 0 }]]
        },
        "Mock GHL API Response": {
            "main": [[{ "node": "Funnel Transformation", "type": "main", "index": 0 }]]
        },
        "Funnel Transformation": {
            "main": [[{ "node": "Data Isolation & Clustering", "type": "main", "index": 0 }]]
        },
        "Data Isolation & Clustering": {
            "main": [[{ "node": "Additional Marketing Metrics", "type": "main", "index": 0 }]]
        },
        "Additional Marketing Metrics": {
            "main": [[{ "node": "Output Formatter", "type": "main", "index": 0 }]]
        }
    };

    fs.writeFileSync('new_workflow.json', JSON.stringify(originalWorkflow, null, 2));
    console.log("Successfully built new_workflow.json");

} catch (err) {
    console.error(err);
}
