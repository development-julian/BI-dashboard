
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
    chartData: { date: string; value: number }[];
  };
  funnelPerformance: FunnelStage[];
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
    case '7d':
      from = subDays(to, 7);
      break;
    case '90d':
      from = subDays(to, 90);
      break;
    case '30d':
    default:
      from = subDays(to, 30);
      break;
  }

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
};

const fetchDataFromN8n = async (action: string, range: string): Promise<{ data?: any; error?: string }> => {
    try {
        console.log(`🚀 [API] Connecting to n8n with action "${action}" for range: ${range}`);
        const dateRange = getDateRange(range);

        const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
            ghlLocationId: "Jg9gu3TzF3KKu2V8nwHl",
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
        
        console.log(`✅ Received response from n8n for action "${action}":`, JSON.stringify(responseData, null, 2));

        if (responseData.success === false) {
            const errorMessage = responseData.message || 'The backend reported an unspecified error.';
            return { error: errorMessage };
        }
        
        if (responseData.success === true && responseData.payload) {
            console.log(`📊 Extracted payload from n8n for action "${action}":`, JSON.stringify(responseData.payload, null, 2));
            return { data: responseData.payload };
        }

        return { error: 'The backend returned data in an unexpected format. Please verify the n8n workflow output.' };

    } catch (error: any) {
        console.error(`🔥 Critical network or unexpected error in fetchDataFromN8n for action "${action}":`, error);
        return { error: error.message || 'An unknown network error occurred.' };
    }
}


export const getDashboardStats = async (range: string = '30d'): Promise<DashboardStats | { error: string, type: string }> => {
  const result = await fetchDataFromN8n('GET_DASHBOARD', range);
  
  if (result.error || !result.data) {
    console.error(`🔥 Error fetching dashboard stats for range "${range}":`, result.error);
    return { error: result.error || 'No data returned from backend.', type: 'network' };
  }
  
  const n8nData = result.data;
  const aiReport = n8nData.intelligenceReport;
  const aiForecastData = {
    title: aiReport?.key_insight || 'Analizando datos estratégicos...',
    description: aiReport?.actionable_recommendation || 'Esperando insights de Gemini para generar un plan de acción.',
    sentiment: aiReport?.sentiment || 'neutral'
  };

  return {
    kpis: [
      {
        label: 'Ad Spend',
        value: `$${(n8nData.kpis?.ad_spend || 0).toLocaleString()}`,
        change: '+2.5%',
        changeType: 'increase',
        icon: 'dollar',
      },
      {
        label: 'ROAS',
        value: `${n8nData.kpis?.roas || 0}x`,
        change: '-1.2%',
        changeType: 'decrease',
        icon: 'percent',
      },
      {
        label: 'CPL',
        value: `$${(n8nData.kpis?.cpl || 0).toFixed(2)}`,
        change: '+8.0%',
        changeType: 'increase',
        icon: 'user',
      },
    ],
    leadConversion: {
      totalLeads: n8nData.kpis?.total_leads || 0,
      totalLeadsChange: '+12%',
      mql: n8nData.funnel?.find((f: any) => f.stage === 'Oportunidades')?.value || 0,
      mqlChange: '+5%',
      conversionRate: n8nData.kpis?.conversion_rate || 0,
      conversionRateTarget: 5.0,
      chartData: (n8nData.kpis?.leads_over_time || []).map((d: any) => ({ date: d.date, value: d.count })),
    },
    funnelPerformance: (n8nData.funnel || []).map((f: any) => ({
      stage: f.stage,
      value: f.value.toLocaleString(),
      meta: `vs ${f.previous_value?.toLocaleString() || 0}`,
      change: `${f.drop_off_percentage || 0}% drop`,
      changeType: 'decrease'
    })),
    aiForecast: aiForecastData,
    productPerformance: (n8nData.products || []).map((p: any) => ({
      name: p.name,
      sku: p.sku || 'SKU-N/A',
      revenue: `$${(p.revenue || 0).toLocaleString()}`,
      change: p.change || '0%',
      changeType: p.status === 'alert' ? 'decrease' : 'increase',
      image: p.image_id || 'product-watch'
    })),
    salesByChannel: (n8nData.salesByChannel || []).map((s: any) => ({
        name: s.channel || s.name,
        value: s.sales || s.value
    }))
  };
};

export const getMarketingData = async (range: string = '30d'): Promise<MarketingData | { error: string, type: string }> => {
    const result = await fetchDataFromN8n('GET_MARKETING_DATA', range);

    if (result.error || !result.data) {
        console.error(`🔥 Error fetching marketing data for range "${range}":`, result.error);
        return { error: result.error || 'No data returned from backend.', type: 'network' };
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

export const getInventoryData = async (range: string = '30d'): Promise<InventoryData | { error: string, type: string }> => {
    const result = await fetchDataFromN8n('GET_INVENTORY_DATA', range);
    
    if (result.error || !result.data) {
        console.error(`🔥 Error fetching inventory data for range "${range}":`, result.error);
        return { error: result.error || 'No data returned from backend.', type: 'network' };
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
    