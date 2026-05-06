
import { subDays, format } from 'date-fns';
import { getSession } from '@/lib/auth';

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
    totalUnits: number;
    totalUnitsChange: string;
    averageTicket: number;
    averageTicketChange: string;
    chartData: any[]; // Dynamic { date, [channelTitle]: number }
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
    dataCounts: Record<string, number>;
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

export const AD_CHANNELS = [
  'Facebook', 'Facebook Ads', 'Google', 'Google Ads', 'Instagram', 'Instagram Ads', 
  'TikTok', 'TikTok Ads', 'LinkedIn', 'LinkedIn Ads', 'Organic', 'Organic Search', 
  'Paid Search', 'Social Media', 'Email', 'Referral', 'YouTube', 'Pinterest'
];

export const isAdChannel = (channel: string) => {
  if (!channel) return false;
  const norm = channel.toLowerCase();
  return AD_CHANNELS.some(ad => norm.includes(ad.toLowerCase()) || ad.toLowerCase().includes(norm));
};


export const N8N_WEBHOOK_URL = 'https://n8n.growtzy.com/webhook/api/v1/gateway';

const getDateRange = (range: string): { from: string; to: string } => {
  const to = new Date();
  let from: Date;

  switch (range) {
    case '1y':
      from = subDays(to, 365);
      break;
    case 'all':
      // Fetching everything, providing a date far into the past (e.g., 2020)
      from = new Date(2020, 0, 1);
      break;
    case '5m':
    default:
      from = subDays(to, 150); // Approx 5 months
      break;
  }

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
};

/**
 * Determines how many months of data to show based on the range filter.
 * Uses the LAST registered month as anchor, then counts backwards.
 */
const getMonthsToShow = (range: string): number => {
  switch (range) {
    case '5m': return 5;
    case '1y': return 12;
    case 'all': return Infinity;
    default: return 5;
  }
};

/**
 * Filters an array of month-based data (with a `date` field like "2024-05")
 * to only include the last N months relative to the last registered month.
 */
const filterByMonthRange = <T extends { date: string }>(data: T[], range: string): T[] => {
  if (!data || data.length === 0) return [];
  
  const monthsToShow = getMonthsToShow(range);
  if (monthsToShow === Infinity) return data;

  // Sort ascending by date to find the last registered month
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  
  // Take the last N months
  return sorted.slice(-monthsToShow);
};

/**
 * Calculate percentage change between current and previous period values
 */
const calcChange = (current: number, previous: number): { change: string; changeType: 'increase' | 'decrease' | 'neutral' } => {
  if (previous === 0 && current === 0) return { change: '0%', changeType: 'neutral' };
  if (previous === 0) return { change: '+100%', changeType: 'increase' };
  
  const pctChange = ((current - previous) / previous) * 100;
  const rounded = Math.round(pctChange * 10) / 10;
  
  if (rounded === 0) return { change: '0%', changeType: 'neutral' };
  if (rounded > 0) return { change: `+${rounded}%`, changeType: 'increase' };
  return { change: `${rounded}%`, changeType: 'decrease' };
};

const fetchDataFromN8n = async (action: string, range: string): Promise<{ data?: any; error?: string }> => {
  try {
    const dateRange = getDateRange(range);
    const session = getSession();

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        ghlLocationId: session?.locationId ?? '',
        dateRange: dateRange,
        userToken: session?.token ?? '',
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
  'Won': 'Won',
  'Agendado': 'Scheduled',
  'Cotización': 'Quote',
  'Cerrado': 'Closed',
  'Perdido': 'Lost',
  'Frío🥶': 'Cold'
};

const translateStage = (stage: string) => stageMapping[stage] || stage;

export const getDashboardStats = async (range: string = '5m'): Promise<DashboardStats | { error: string, type: string }> => {
  const result = await fetchDataFromN8n('GET_DASHBOARD', range);

  if (result.error || !result.data) {
    return { error: result.error || 'No data returned from backend.', type: 'Backend Communication' };
  }

  const n8nData = result.data;

  // ── Extract KPIs from the real payload (these ARE filtered by n8n) ──
  const kpis = n8nData.kpis || {};
  const totalLeads = kpis.total_leads || 0;
  const totalRevenue = kpis.total_revenue || 0;
  const wonDeals = kpis.won_deals || 0;
  const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : (kpis.conversion_rate || 0);

  // ── AI intelligence report ──
  const report = n8nData.intelligenceReport?.analysis || n8nData.intelligenceReport || {};
  const aiForecastData = {
    title: report.key_insight || 'No AI insights available.',
    description: report.actionable_recommendation || 'AI Copilot is analyzing the data. Check back later for strategic recommendations.',
    sentiment: (n8nData.intelligenceReport?.sentiment || 'neutral') as 'positive' | 'negative' | 'neutral'
  };

  // ══════════════════════════════════════════════════════════════════════
  // FRONTEND TEMPORAL FILTERING
  // n8n returns ALL historical data for charts — we filter here by range
  // ══════════════════════════════════════════════════════════════════════

  // ── 1. LEAD CONVERSION TRENDS (Monthly Sales by Channel) ──
  // n8n always returns all 22 months — filter to show only months in the selected range
  const rawConversionTrends = n8nData.charts?.lead_conversion_trends || [];
  const filteredConversionTrends = filterByMonthRange(rawConversionTrends, range);

  let chartData: any[] = [];
  if (filteredConversionTrends.length > 0) {
    chartData = filteredConversionTrends.map((item: any) => {
      const flatItem: any = { date: item.date || item.month };
      if (item.metrics) {
        Object.keys(item.metrics).forEach(key => {
          flatItem[key] = item.metrics[key];
        });
      } else {
        Object.keys(item).forEach(key => {
          if (key !== 'date' && key !== 'month') {
            flatItem[key] = item[key];
          }
        });
      }
      return flatItem;
    });
  } else {
    // Fallback if no data
    const today = new Date();
    const daysInRange = range === '1y' ? 365 : range === 'all' ? 730 : 150;
    const dailyAvg = totalLeads > 0 ? totalLeads / daysInRange : 0;
    chartData = Array.from({ length: Math.min(daysInRange, 14) }).map((_, i) => {
      const date = subDays(today, Math.min(daysInRange, 14) - 1 - i);
      const seed = (date.getDate() * 7 + date.getMonth() * 13) % 5;
      const value = Math.max(0, Math.round(dailyAvg + seed - 2));
      return {
        date: format(date, 'MMM d'),
        value,
        baselineTarget: Math.round(dailyAvg * 2) || 5
      };
    });
  }

  // ── 2. SALES VOLUME TRENDS (for Units & Average Ticket) ──
  // Filter sales_volume_trends by the same range to derive totalUnits and averageTicket
  const rawVolumeTrends = n8nData.charts?.sales_volume_trends || [];
  const filteredVolumeTrends = filterByMonthRange(rawVolumeTrends, range);

  let totalUnitsFiltered = 0;
  let totalRevenueFromVolume = 0;
  let averageTicketFiltered = 0;

  if (filteredVolumeTrends.length > 0) {
    filteredVolumeTrends.forEach((month: any) => {
      totalUnitsFiltered += month.totalUnits || 0;
      const monthRevenue = month.metrics
        ? Object.values(month.metrics as Record<string, number>).reduce((sum: number, v: number) => sum + v, 0)
        : 0;
      totalRevenueFromVolume += monthRevenue;
    });
    averageTicketFiltered = totalUnitsFiltered > 0 ? Math.round(totalRevenueFromVolume / totalUnitsFiltered) : 0;
  }

  // ── 3. Calculate period-over-period changes for Units & Ticket ──
  // Compare current filtered period vs previous equally-sized period
  let unitsChange = { change: '0%', changeType: 'neutral' as const };
  let ticketChange = { change: '0%', changeType: 'neutral' as const };
  let revenueChange = { change: '0%', changeType: 'neutral' as const };

  if (rawVolumeTrends.length > 0 && range !== 'all') {
    const monthsCount = getMonthsToShow(range);
    const sortedAll = [...rawVolumeTrends].sort((a: any, b: any) => a.date.localeCompare(b.date));
    const currentPeriod = sortedAll.slice(-monthsCount);
    const previousPeriod = sortedAll.slice(-monthsCount * 2, -monthsCount);

    if (previousPeriod.length > 0) {
      const prevUnits = previousPeriod.reduce((sum: number, m: any) => sum + (m.totalUnits || 0), 0);
      const prevRevenue = previousPeriod.reduce((sum: number, m: any) => {
        return sum + (m.metrics ? Object.values(m.metrics as Record<string, number>).reduce((s: number, v: number) => s + v, 0) : 0);
      }, 0);
      const prevTicket = prevUnits > 0 ? Math.round(prevRevenue / prevUnits) : 0;

      unitsChange = calcChange(totalUnitsFiltered, prevUnits);
      ticketChange = calcChange(averageTicketFiltered, prevTicket);
      revenueChange = calcChange(totalRevenueFromVolume, prevRevenue);
    }
  }

  // ── 4. KPI changes — compute from filtered volume data when available ──
  const totalRevenueChange = totalRevenueFromVolume > 0
    ? revenueChange
    : calcChange(totalRevenue, 0);

  // ── Funnel: real payload uses `funnel[]` with {stage, value}, not `charts.sales_funnel` ──
  const realFunnel = n8nData.funnel || [];
  const chartsFunnel = n8nData.charts?.sales_funnel || [];
  const funnelSource = realFunnel.length > 0 ? realFunnel : chartsFunnel;
  const funnelPerformance = funnelSource.map((f: any) => ({
    stage: translateStage(f.stage),
    count: f.value ?? f.count ?? 0,
    organic_count: f.organic_count,
    paid_count: f.paid_count,
  }));

  // ── Source Acquisition by channel (De dónde llegan tus clientes) ──
  // n8n returns same data for all filters (mock DIGITAL_CHANNELS), pass through as-is
  const realSalesByChannel = (n8nData.salesByChannel || [])
    .map((s: any) => ({
      name: s.label || s.name || s.channel || 'Unknown',
      value: s.value || 0,
    }));

  // ── Cluster data ──
  const clusterData = (n8nData.charts?.cluster_data && n8nData.charts.cluster_data.length > 0)
    ? n8nData.charts.cluster_data
    : [];

  // ── Win rate by source ──
  const winRateBySource = (n8nData.charts?.win_rate_by_source && n8nData.charts.win_rate_by_source.length > 0)
    ? n8nData.charts.win_rate_by_source
    : [];

  // ── Pipeline value by stage ──
  const pipelineValueByStage = (n8nData.charts?.pipeline_value_by_stage && n8nData.charts.pipeline_value_by_stage.length > 0)
    ? n8nData.charts.pipeline_value_by_stage
    : [];

  // ── Advanced KPIs ──
  const extraKpis = {
    avgResponseTime: kpis.avg_response_time || 0,
    avgEngagement: kpis.avg_engagement || 0,
    cpa: totalLeads > 0 && kpis.total_revenue !== undefined
      ? (kpis.cpa || (totalRevenue > 0 ? Math.round(totalRevenue / wonDeals) : 0))
      : 0,
  };

  // ── Product performance ──
  // Products come from hardcoded Excel data in n8n, revenues are totals across all time
  // We recalculate based on sales_volume_trends filtered data
  const rawProducts = n8nData.products || [];
  const productPerformance = rawProducts.map((p: any) => ({
    name: p.name,
    sku: p.sku || 'SKU-N/A',
    revenue: `$${(p.revenue || 0).toLocaleString()}`,
    change: p.change || '0%',
    changeType: (p.changeType === 'decrease' ? 'decrease' : p.changeType === 'increase' ? 'increase' : 'neutral') as 'increase' | 'decrease' | 'neutral',
    image: p.image_url || p.image || ''
  }));

  // ── Compute total sales from filtered volume data ──
  const totalSalesFromVolume = totalRevenueFromVolume > 0 ? totalRevenueFromVolume : totalRevenue;

  return {
    kpis: [
      {
        label: 'Total Revenue',
        value: `$${totalSalesFromVolume.toLocaleString()}`,
        change: totalRevenueChange.change,
        changeType: totalRevenueChange.changeType,
        icon: 'dollar',
      },
      {
        label: 'Total Leads',
        value: `${totalLeads.toLocaleString()}`,
        change: totalLeads > 0 ? `${totalLeads}` : '0',
        changeType: totalLeads > 0 ? 'increase' : 'neutral',
        icon: 'user',
      },
      {
        label: 'Conversion Rate',
        value: `${conversionRate.toFixed(1)}%`,
        change: conversionRate > 0 ? `${conversionRate.toFixed(1)}%` : '0%',
        changeType: conversionRate > 0 ? 'increase' : 'neutral',
        icon: 'percent',
      },
    ],
    leadConversion: {
      totalLeads,
      totalLeadsChange: totalLeads > 0 ? `${totalLeads}` : '0',
      mql: wonDeals,
      mqlChange: wonDeals > 0 ? `${wonDeals}` : '0',
      conversionRate,
      conversionRateTarget: 5.0,
      totalUnits: totalUnitsFiltered,
      totalUnitsChange: unitsChange.change,
      averageTicket: averageTicketFiltered,
      averageTicketChange: ticketChange.change,
      chartData,
      status: totalLeads >= 20 ? 'ok' : 'insufficient_data',
    },
    funnelPerformance,
    clusterData,
    winRateBySource,
    pipelineValueByStage,
    extraKpis,
    aiForecast: aiForecastData,
    productPerformance,
    salesByChannel: realSalesByChannel,
    metadata: {
      status: totalLeads >= 20 ? 'ok' : 'insufficient_data',
      dataPointsCount: totalLeads,
      dateRangeApplied: range,
      dataCounts: {
        total_leads: totalLeads,
        conversion_rate: wonDeals,
        total_revenue: totalRevenue,
        lead_trend: chartData.length > 0 ? totalLeads : 0, 
        sales_funnel: funnelPerformance.reduce((acc: number, f: any) => acc + f.count, 0),
        cluster_view: clusterData.length,
        win_rate_by_source: winRateBySource.length,
        pipeline_value: pipelineValueByStage.length,
        marketing_kpis: totalLeads,
        product_performance: productPerformance.length,
        sales_by_channel: realSalesByChannel.length
      }
    }
  };
};

export const getMarketingData = async (range: string = '5m'): Promise<MarketingData | { error: string, type: string }> => {
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

export const getInventoryData = async (range: string = '5m'): Promise<InventoryData | { error: string, type: string }> => {
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
