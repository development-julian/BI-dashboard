'use server';

export interface DashboardStats {
  kpis: {
    label: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
    icon: 'dollar' | 'percent' | 'user' | 'activity';
  }[];
  leadConversion: {
    totalLeads: number;
    totalLeadsChange: string;
    mql: number;
    mqlChange: string;
    conversionRate: number;
    conversionRateTarget: number;
    chartData: { date: string; value: number }[];
  };
  funnelPerformance: {
    stage: string;
    value: string;
    meta: string;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
  }[];
  aiForecast: {
    title: string;
    description: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  };
  productPerformance: {
    name: string;
    sku: string;
    revenue: string;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
    image: string;
  }[];
  salesByChannel: {
    name: string;
    value: number;
  }[];
}

// URL DE PRODUCCIÓN (Asegúrate de que n8n esté en modo "Active")
const N8N_WEBHOOK_URL = 'https://willirv.app.n8n.cloud/webhook/api/v1/gateway';

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    console.log("🚀 Enviando petición POST a n8n...");

    const res = await fetch(N8N_WEBHOOK_URL, { 
      method: 'POST', // <--- ¡ESTO ES LO QUE FALTABA!
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "GET_DASHBOARD", // Actualizado según sugerencia de IA
        ghlLocationId: "loc_test_123",
        userToken: "token_seguro_firebase",
        dateRange: {
          from: "2024-01-01",
          to: "2024-12-31"
        }
      }),
      cache: 'no-store' // Evita que Next.js guarde respuestas viejas
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Error n8n (${res.status}): ${errorText}`);
      return null;
    }
    
    const n8nData = await res.json();
    console.log("✅ Datos recibidos de n8n:", JSON.stringify(n8nData).substring(0, 200) + "...");

    // Adaptador de datos
    return {
      kpis: [
        {
          label: 'Ad Spend',
          value: `$${n8nData.kpis?.ad_spend || 0}`,
          change: '0%', 
          changeType: 'neutral',
          icon: 'dollar',
        },
        {
          label: 'ROAS',
          value: `${n8nData.kpis?.roas || 0}x`,
          change: '0%',
          changeType: Number(n8nData.kpis?.roas) > 2 ? 'increase' : 'decrease',
          icon: 'percent',
        },
        {
          label: 'Total Revenue',
          value: `$${n8nData.kpis?.total_revenue || 0}`,
          change: '+100%',
          changeType: 'increase',
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
        chartData: [
          { date: 'Actual', value: n8nData.kpis?.total_leads || 0 },
        ],
      },
      funnelPerformance: (n8nData.funnel || []).map((f: any) => ({
        stage: f.stage,
        value: f.value.toString(),
        meta: 'Active',
        change: '0%',
        changeType: 'neutral'
      })),
      aiForecast: {
        title: n8nData.intelligenceReport?.analysis?.key_insight || "Analizando...",
        description: n8nData.intelligenceReport?.analysis?.actionable_recommendation || "Esperando datos...",
        sentiment: n8nData.intelligenceReport?.analysis?.sentiment || "neutral"
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
