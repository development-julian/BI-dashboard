
import { subDays, format } from 'date-fns';

export interface KpiCard {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: 'dollar' | 'percent' | 'user';
}

export interface FunnelStage {
  stage: string;
  value: string;
  meta: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface ProductPerformance {
  name: string;
  sku: string;
  revenue: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  image: string;
}

export interface DashboardStats {
  kpis: KpiCard[];
  leadConversion: {
    totalLeads: number;
    totalLeadsChange: string;
    mql: number;
    mqlChange: string;
    conversionRate: number;
    conversionRateTarget: number;
    chartData: { date: string; value: number; baselineTarget?: number }[];
    status: 'ok' | 'insufficient_data';
  };
  funnelPerformance: { stage: string; count: number }[];
  clusterData: { id: string; x_engagement: number; y_value: number; category: string; status: string }[];
  winRateBySource: { source: string; win_rate: number; total_revenue: number; roi: number }[];
  pipelineValueByStage: { stage: string; value: number }[];
  extraKpis: {
    avgResponseTime: number;
    avgEngagement: number;
    cpa: number;
  };
  aiForecast: {
    title: string;
    description: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  };
  productPerformance: ProductPerformance[];
  salesByChannel: {
    name: string;
    value: number;
  }[];
  metadata: {
    status: 'ok' | 'insufficient_data';
    dataPointsCount: number;
    dateRangeApplied: string;
  };
}

export interface MarketingData {
  campaignPerformance: {
    id: string;
    name: string;
    spend: number;
    cpc: number;
    conversions: number;
    roas: number;
    status: 'active' | 'paused' | 'ended';
  }[];
  channelBreakdown: {
    channel: string;
    spend: number;
    conversions: number;
  }[];
}

export interface InventoryData {
  products: {
    name: string;
    sku: string;
    stockLevel: number;
    stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
    revenue: number;
    image: string;
  }[];
}


export const N8N_WEBHOOK_URL = 'https://n8n.growtzy.com/webhook/api/v1/gateway';

const getDateRange = (range: string): { from: string; to: string } => {
  const to = new Date();
  let from: Date;

  switch (range) {
    case '30d':
      from = subDays(to, 30);
      break;
    case '90d':
      from = subDays(to, 90);
      break;
    case '7d':
    default:
      from = subDays(to, 7);
      break;
  }

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
};

const fetchDataFromN8n = async (action: string, range: string): Promise<{ data?: any; error?: string }> => {
  try {
    const dateRange = getDateRange(range);

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        ghlLocationId: "PLsKcTpoijAF5iHuqikq",
        dateRange: dateRange
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Could not read error response body');
      return { error: `The backend service responded with status ${res.status}. Please check the n8n workflow. Response: ${errorText}` };
    }

    const responseText = await res.text();
    if (!responseText) {
      return { error: "The backend returned an empty response. Please verify the n8n workflow output." };
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      return { error: `The backend did not return valid JSON. Please verify the n8n workflow output. Raw Response: ${responseText}` };
    }

    if (responseData.success === false) {
      const errorMessage = responseData.message || 'The backend reported an unspecified error.';
      return { error: errorMessage };
    }

    if (responseData.success === true && responseData.payload) {
      return { data: responseData.payload };
    }

    return { error: 'The backend returned data in an unexpected format. Please verify the n8n workflow output.' };

  } catch (error: any) {
    const networkErrorMessage = `A network error occurred while trying to connect to the backend. Please check your connection and ensure the backend is running. Details: ${error.message || 'An unknown network error occurred.'}`
    return { error: networkErrorMessage };
  }
}

const stageMapping: { [key: string]: string } = {
  'Interesado💫': 'Interested',
  'Comprador🎉': 'Purchased',
  'Seguimiento⭐': 'Follow-up',
  'Recordatorio✅': 'Reminder',
  'New Lead': 'New Lead',
  'Contacted': 'Contacted',
  'Qualified': 'Qualified',
  'Proposal': 'Proposal',
  'Won': 'Won'
};

const translateStage = (stage: string) => stageMapping[stage] || stage;

export const getDashboardStats = async (range: string = '7d'): Promise<DashboardStats | { error: string, type: string }> => {
  const result = await fetchDataFromN8n('GET_DASHBOARD', range);
  
  let n8nData: any;

  if (result.error || !result.data) {
    n8nData = {
      kpis: {
        total_leads: 7,
        total_revenue: 2000,
        avg_response_time: 75,
        avg_engagement: 54.29,
        cpa: 550
      },
      charts: {
        sales_funnel: [
          { stage: "New Lead", count: 2 },
          { stage: "Contacted", count: 1 },
          { stage: "Qualified", count: 1 },
          { stage: "Proposal", count: 1 },
          { stage: "Won", count: 2 }
        ],
        cluster_data: [
          { id: "opp_1", x_engagement: 20, y_value: 500, category: "Facebook Ads", status: "open" },
          { id: "opp_2", x_engagement: 90, y_value: 1200, category: "Google Ads", status: "won" },
          { id: "opp_3", x_engagement: 40, y_value: 300, category: "Organic", status: "open" },
          { id: "opp_4", x_engagement: 85, y_value: 800, category: "Organic", status: "won" },
          { id: "opp_5", x_engagement: 60, y_value: 1500, category: "Facebook Ads", status: "open" },
          { id: "opp_6", x_engagement: 75, y_value: 2000, category: "Google Ads", status: "open" },
          { id: "opp_7", x_engagement: 10, y_value: 400, category: "Facebook Ads", status: "lost" }
        ],
        win_rate_by_source: [
          { source: "Facebook Ads", win_rate: 0, total_revenue: 0, roi: -100 },
          { source: "Google Ads", win_rate: 50, total_revenue: 1200, roi: 100 },
          { source: "Organic", win_rate: 50, total_revenue: 800, roi: 100 }
        ],
        pipeline_value_by_stage: [
          { stage: "New Lead", value: 900 },
          { stage: "Won", value: 2000 },
          { stage: "Contacted", value: 300 },
          { stage: "Qualified", value: 1500 },
          { stage: "Proposal", value: 2000 }
        ]
      },
      metadata: {
        total_records_processed: 7,
        status: "success",
        totalVolume: 7
      },
      intelligenceReport: {
        key_insight: 'Fallback data is being used.',
        actionable_recommendation: 'The connection to the n8n backend failed. Please check the workflow and API gateway.',
        sentiment: 'neutral'
      }
    };
  } else {
    n8nData = result.data;
  }
  
  const kpis = n8nData.kpis || {};
  const charts = n8nData.charts || {};
  const totalVolume = kpis.total_leads || (charts.sales_funnel || []).reduce((acc: number, s: any) => acc + (s.count || 0), 0);

  const aiForecastData = {
    title: n8nData.intelligenceReport?.key_insight || 'No AI insights available.',
    description: n8nData.intelligenceReport?.actionable_recommendation || 'AI Copilot is analyzing the data. Check back later for strategic recommendations.',
    sentiment: n8nData.intelligenceReport?.sentiment || 'neutral'
  };

  const today = new Date();
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    const value = (kpis.total_leads || 0) > 0 ? Math.floor(Math.random() * (kpis.total_leads / 2)) + 5 : Math.floor(Math.random() * 10);
    return {
      date: format(date, 'MMM d'),
      value: value,
      baselineTarget: Math.floor(Math.random() * 5) + 10
    };
  });
  
  return {
    kpis: [
      {
        label: 'Total Revenue',
        value: `$${(kpis.total_revenue || 0).toLocaleString()}`,
        change: '+2.5%',
        changeType: 'increase',
        icon: 'dollar',
      },
      {
        label: 'Total Leads',
        value: `${(kpis.total_leads || 0).toLocaleString()}`,
        change: '+8.0%',
        changeType: 'increase',
        icon: 'user',
      },
      {
        label: 'Conversion Rate',
        value: `${(kpis.total_revenue && kpis.total_leads ? (kpis.total_revenue / kpis.total_leads) : 0).toFixed(1)}%`,
        change: '-1.2%',
        changeType: 'decrease',
        icon: 'percent',
      },
    ],
    leadConversion: {
      totalLeads: kpis.total_leads || 0,
      totalLeadsChange: '+12%',
      mql: Math.floor((kpis.total_leads || 0) * 0.75),
      mqlChange: '+5%',
      conversionRate: (kpis.total_revenue && kpis.total_leads ? (kpis.total_revenue / kpis.total_leads) : 0),
      conversionRateTarget: 5.0,
      chartData: chartData,
      status: totalVolume >= 20 ? 'ok' : 'insufficient_data',
    },
    funnelPerformance: (charts.sales_funnel || []).map((f: any) => ({
      stage: translateStage(f.stage),
      count: f.count || 0,
    })),
    clusterData: charts.cluster_data || [],
    winRateBySource: charts.win_rate_by_source || [],
    pipelineValueByStage: charts.pipeline_value_by_stage || [],
    extraKpis: {
      avgResponseTime: kpis.avg_response_time || 0,
      avgEngagement: kpis.avg_engagement || 0,
      cpa: kpis.cpa || 0,
    },
    aiForecast: aiForecastData,
    productPerformance: [],
    salesByChannel: [], 
    metadata: {
      status: totalVolume >= 20 ? 'ok' : 'insufficient_data',
      dataPointsCount: totalVolume,
      dateRangeApplied: range
    }
  };
};

export const getMarketingData = async (range: string = '7d'): Promise<MarketingData | { error: string, type: string }> => {
  const result = await fetchDataFromN8n('GET_MARKETING_DATA', range);

  if (result.error || !result.data) {
    return { error: result.error || 'No data returned from backend.', type: 'Backend Communication' };
  }

  const n8nData = result.data;
  return {
    campaignPerformance: (n8nData.campaignPerformance || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      spend: c.spend || 0,
      cpc: c.cpc || 0,
      conversions: c.conversions || 0,
      roas: c.roas || 0,
      status: c.status || 'paused',
    })),
    channelBreakdown: (n8nData.channelBreakdown || []).map((c: any) => ({
      channel: c.channel,
      spend: c.spend || 0,
      conversions: c.conversions || 0,
    })),
  };
}

export const getInventoryData = async (range: string = '7d'): Promise<InventoryData | { error: string, type: string }> => {
  const result = await fetchDataFromN8n('GET_INVENTORY_DATA', range);

  if (result.error || !result.data) {
    return { error: result.error || 'No data returned from backend.', type: 'Backend Communication' };
  }

  const n8nData = result.data;
  return {
    products: (n8nData.products || []).map((p: any) => ({
      name: p.name,
      sku: p.sku || 'SKU-N/A',
      stockLevel: p.stockLevel || 0,
      stockStatus: p.stockStatus || 'Out of Stock',
      revenue: p.revenue || 0,
      image: p.image_id || 'product-watch'
    })),
  };
}
