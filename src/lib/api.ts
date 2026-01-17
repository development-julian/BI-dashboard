
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

export const getDashboardStats = async (): Promise<DashboardStats | { error: string, type: 'format' | 'processing' | 'network' }> => {
  try {
    console.log("🚀 [API] Conectando a n8n con método POST...");

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "GET_DASHBOARD",
        ghlLocationId: "PLsKcTpoijAF5iHuqikq",
        dateRange: { from: "2024-01-01", to: "2024-12-31" }
      }),
      cache: 'no-store'
    });

    const rawText = await res.text();
    console.log("📦 Respuesta CRUDA (texto) de n8n:", rawText);

    if (!res.ok) {
      console.error(`❌ Error en la respuesta de n8n: ${res.status} ${res.statusText}`);
      return { error: `n8n respondió con estado ${res.status}: ${rawText}`, type: 'network' };
    }
    
    let jsonData;
    try {
        if (rawText.startsWith('=')) {
            // Limpia la cadena si empieza con '='
            const jsonString = rawText.substring(rawText.indexOf('=') + 1);
            jsonData = JSON.parse(jsonString);
        } else {
            // Asume que es un JSON válido o un array JSON
            jsonData = JSON.parse(rawText);
        }
    } catch (parseError) {
        console.error("❌ Error de parseo JSON:", parseError);
        return { error: `La respuesta de n8n no es un JSON válido. Respuesta recibida: ${rawText}`, type: 'format' };
    }
    
    console.log("✅ Respuesta PARSEADA de n8n:", JSON.stringify(jsonData, null, 2));

    const n8nResponseObject = Array.isArray(jsonData) ? jsonData[0] : jsonData;
     if (!n8nResponseObject) {
      console.error("❌ La respuesta de n8n está vacía o en un formato inesperado después de parsear.");
      return { error: 'El formato de respuesta de n8n está vacío o es inválido.', type: 'format' };
    }
    
    const n8nData = n8nResponseObject.payload;

    if (!n8nData) {
      console.error("❌ No se encontró la propiedad 'payload' en el objeto de respuesta de n8n.");
      return { error: 'No se encontró la propiedad "payload" en la respuesta de n8n.', type: 'format' };
    }
    
    console.log("📊 Datos extraídos de n8n.payload:", JSON.stringify(n8nData, null, 2));
    
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
    return { error: `No se pudo conectar con el servidor: ${error.message}`, type: 'network' };
  }
};
