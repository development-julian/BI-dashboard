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
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "GET_DASHBOARD",
        ghlLocationId: "loc_test_123",
        userToken: "token_seguro_firebase",
        dateRange: {
          from: "2024-01-01",
          to: "2024-12-31"
        }
      }),
      cache: 'no-store' 
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
          value: `$${(n8nData.kpis?.ad_spend || 0).toLocaleString()}`,
          change: '+5.2%', 
          changeType: 'increase',
          icon: 'dollar',
        },
        {
          label: 'ROAS',
          value: `${n8nData.kpis?.roas || 0}x`,
          change: '-2.1%',
          changeType: Number(n8nData.kpis?.roas) > 2 ? 'increase' : 'decrease',
          icon: 'percent',
        },
        {
          label: 'Total Revenue',
          value: `$${(n8nData.kpis?.total_revenue || 0).toLocaleString()}`,
          change: '+12.5%',
          changeType: 'increase',
          icon: 'dollar',
        },
      ],
      leadConversion: {
        totalLeads: n8nData.kpis?.total_leads || 0,
        totalLeadsChange: '+14%',
        mql: n8nData.funnel?.find((f: any) => f.stage === 'Oportunidades')?.value || 0,
        mqlChange: '+8%',
        conversionRate: n8nData.kpis?.conversion_rate || 0,
        conversionRateTarget: 5.0,
        chartData: n8nData.lead_conversion_trends || [
          { date: 'Jan', value: 0 },
        ],
      },
      funnelPerformance: (n8nData.funnel || []).map((f: any, index: number, arr: any[]) => {
        let change = '0%';
        let changeType: 'increase' | 'decrease' | 'neutral' = 'neutral';
        if (index > 0) {
          const prevValue = arr[index - 1].value;
          if (prevValue > 0) {
            const percentage = (f.value / prevValue) * 100;
            change = `${percentage.toFixed(1)}%`;
            changeType = f.value > 0 ? 'increase' : 'decrease';
          }
        }
        return {
          stage: f.stage,
          value: f.value.toLocaleString(),
          meta: f.stage === 'Sales' ? '320% ROI' : `Reach: ${f.value * 2} users`,
          change: change,
          changeType: changeType,
        };
      }),
      aiForecast: {
        title: n8nData.intelligenceReport?.analysis?.key_insight || "Stock Alert: Product A running low",
        description: n8nData.intelligenceReport?.analysis?.actionable_recommendation || "Order 50 more units to avoid stockout. Consider a flash sale on Product B.",
        sentiment: n8nData.intelligenceReport?.analysis?.sentiment || "negative"
      },
      productPerformance: (n8nData.products || []).map((p: any) => ({
        name: p.name,
        sku: p.sku || 'SKU-GEN',
        revenue: `$${(p.revenue || 0).toLocaleString()}`,
        change: p.status === 'alert' ? '-5% (Low Stock)' : '+10%',
        changeType: p.status === 'alert' ? 'decrease' : 'increase',
        image: 'product-watch' // Asignación de imagen estática por ahora
      })),
      salesByChannel: n8nData.salesByChannel || [
        { name: 'Social', value: 0 },
        { name: 'Organic', value: 0 },
      ]
    };

  } catch (error) {
    console.error("🔥 Error crítico en getDashboardStats:", error);
    return null; 
  }
};
