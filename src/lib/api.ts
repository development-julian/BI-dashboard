'use server';

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

const N8N_WEBHOOK_URL = 'https://growtzy-dev1.app.n8n.cloud/webhook/api/v1/gateway';

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    console.log("🚀 [API] Conectando a n8n con método POST...");

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "GET_DASHBOARD",
        ghlLocationId: "Jg9gu3TzF3KKu2V8nwHl",
        dateRange: { from: "2024-01-01", to: "2024-12-31" }
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`❌ Error en la respuesta de n8n: ${res.status} ${res.statusText}`);
      console.error(`📦 Cuerpo del error:`, errorBody);
      return null;
    }

    const rawResponse = await res.json();
    console.log("📦 Respuesta cruda de n8n:", JSON.stringify(rawResponse, null, 2));

    // --- CORRECCIÓN CRÍTICA: n8n devuelve un Array ---
    if (!Array.isArray(rawResponse) || rawResponse.length === 0) {
      console.error("❌ El formato de respuesta de n8n no es un array válido o está vacío.");
      return null;
    }
    
    // Extraemos el objeto principal y luego la propiedad 'data'
    const n8nData = rawResponse[0]?.data;

    if (!n8nData) {
      console.error("❌ No se encontró la propiedad 'data' en la respuesta de n8n.");
      return null;
    }
    
    console.log("📊 Datos extraídos de n8n.data:", n8nData);

    // Adaptador Seguro
    return {
      kpis: [
        {
          label: 'Ad Spend',
          value: `$${(n8nData.kpis?.ad_spend || 0).toLocaleString()}`,
          change: '0%',
          changeType: 'neutral',
          icon: 'dollar',
        },
        {
          label: 'ROAS',
          value: `${n8nData.kpis?.roas || 0}x`,
          change: '0%',
          changeType: (n8nData.kpis?.roas || 0) > 2 ? 'increase' : 'decrease',
          icon: 'percent',
        },
        {
          label: 'CPL',
          value: `$${(n8nData.kpis?.cpl || 0).toFixed(2)}`,
          change: '0%',
          changeType: 'neutral',
          icon: 'user',
        },
      ],
      leadConversion: {
        totalLeads: n8nData.kpis?.total_leads || 0,
        totalLeadsChange: '+0%',
        mql: n8nData.funnel?.find((f: any) => f.stage === 'Oportunidades')?.value || 0,
        mqlChange: '0%',
        conversionRate: n8nData.kpis?.conversion_rate || 0,
        conversionRateTarget: 5.0,
        chartData: n8nData.kpis?.leads_over_time || [{ date: 'Actual', value: n8nData.kpis?.total_leads || 0 }],
      },
      funnelPerformance: (n8nData.funnel || []).map((f: any) => ({
        stage: f.stage,
        value: f.value.toString(),
        meta: 'Active',
        change: `${f.drop_off_percentage || 0}% drop`,
        changeType: 'decrease'
      })),
      aiForecast: {
        title: `Alerta de Stock: Producto A`,
        description: "Nivel bajo de inventario. Se recomienda reponer para evitar quiebre de stock.",
        sentiment: "negative"
      },
      productPerformance: (n8nData.products || []).map((p: any) => ({
        name: p.name,
        sku: 'SKU-GEN',
        revenue: '$0',
        change: p.status === 'alert' ? 'Low Stock' : 'In Stock',
        changeType: p.status === 'alert' ? 'decrease' : 'increase',
        image: 'product-watch'
      })),
      salesByChannel: n8nData.salesByChannel || []
    };

  } catch (error) {
    console.error("🔥 Error crítico en getDashboardStats:", error);
    return null;
  }
};
