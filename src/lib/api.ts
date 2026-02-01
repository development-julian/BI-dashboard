
'use server';

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


const N8N_WEBHOOK_URL = 'https://n8n.growtzy.com/webhook/api/v1/gateway';

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

const fetchDataFromN8n = async (action: string, range: string) => {
    console.log(`🚀 [API] Conectando a n8n con acción "${action}" para el rango: ${range}`);
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

    const rawText = await res.text();
    console.log(`📦 Respuesta CRUDA (texto) de n8n para acción "${action}":`, rawText);

    if (!res.ok) {
      console.error(`❌ Error en la respuesta de n8n: ${res.status} ${res.statusText}`);
      throw new Error(`n8n respondió con estado ${res.status}: ${rawText}`);
    }
    
    let jsonData;
    try {
        // Limpia la cadena si empieza con un caracter inválido que a veces añade n8n
        const jsonString = rawText.substring(rawText.indexOf('{'));
        jsonData = JSON.parse(jsonString);
    } catch (parseError) {
        console.error("❌ Error de parseo JSON:", parseError);
        throw new Error(`La respuesta de n8n no es un JSON válido. Respuesta recibida: ${rawText}`);
    }
    
    console.log(`✅ Respuesta PARSEADA de n8n para acción "${action}":`, JSON.stringify(jsonData, null, 2));

    const n8nResponseObject = Array.isArray(jsonData) ? jsonData[0] : jsonData;
     if (!n8nResponseObject) {
      throw new Error('El formato de respuesta de n8n está vacío o es inválido.');
    }
    
    const n8nData = n8nResponseObject.payload;

    if (!n8nData) {
      throw new Error('No se encontró la propiedad "payload" en la respuesta de n8n.');
    }
    
    console.log(`📊 Datos extraídos de n8n.payload para acción "${action}":`, JSON.stringify(n8nData, null, 2));
    return n8nData;
}


export const getDashboardStats = async (range: string = '30d'): Promise<DashboardStats | { error: string, type: 'format' | 'processing' | 'network' }> => {
  try {
    const n8nData = await fetchDataFromN8n('GET_DASHBOARD', range);
    
    try {
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
    } catch (e: any) {
        console.error("🔥 Error de PROCESAMIENTO al mapear datos de n8n:", e);
        return { error: `Error al procesar los datos de n8n: ${e.message}`, type: 'processing' };
    }

  } catch (error: any) {
    console.error("🔥 Error CRÍTICO en getDashboardStats (fetch):", error);
    const type = error.message.includes('JSON') ? 'format' : 'network';
    return { error: `No se pudo conectar o procesar la respuesta del servidor: ${error.message}`, type };
  }
};

export const getMarketingData = async (range: string = '30d'): Promise<MarketingData | { error: string, type: string }> => {
    try {
        const n8nData = await fetchDataFromN8n('GET_MARKETING_DATA', range);
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
    } catch (error: any) {
        console.error("🔥 Error CRÍTICO en getMarketingData (fetch):", error);
        const type = error.message.includes('JSON') ? 'format' : 'network';
        return { error: `No se pudo conectar o procesar la respuesta del servidor: ${error.message}`, type };
    }
}

export const getInventoryData = async (range: string = '30d'): Promise<InventoryData | { error: string, type: string }> => {
    try {
        const n8nData = await fetchDataFromN8n('GET_INVENTORY_DATA', range);
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
    } catch (error: any) {
        console.error("🔥 Error CRÍTICO en getInventoryData (fetch):", error);
        const type = error.message.includes('JSON') ? 'format' : 'network';
        return { error: `No se pudo conectar o procesar la respuesta del servidor: ${error.message}`, type };
    }
}
    
