'use server';

// Reemplaza esto con tu URL de n8n (Webhook de Producción)
const N8N_WEBHOOK_URL = 'https://growtzy-dev1.app.n8n.cloud/webhook/api/v1/gateway'; 

export const getDashboardStats = async (): Promise<any> => { // Cambié DashboardStats a any por flexibilidad inicial
  try {
    // 1. Llamar a tu Backend n8n
    const res = await fetch(N8N_WEBHOOK_URL, { 
      method: 'GET', // O POST si configuraste POST
      cache: 'no-store' // Para tener datos frescos siempre
    });
    
    if (!res.ok) throw new Error('Error fetching data from n8n');
    
    const n8nData = await res.json();
    // Suponiendo que n8n devuelve: { kpis, funnel, products, intelligenceReport }

    // 2. ADAPTADOR: Transformar datos de n8n al formato del Frontend
    return {
      kpis: [
        {
          label: 'Ad Spend',
          value: `$${n8nData.kpis.ad_spend}`,
          change: '0%', // n8n no calcula cambio histórico aún
          changeType: 'neutral',
          icon: 'dollar',
        },
        {
          label: 'ROAS',
          value: `${n8nData.kpis.roas}x`,
          change: '0%',
          changeType: n8nData.kpis.roas > 2 ? 'increase' : 'decrease',
          icon: 'percent',
        },
        {
          label: 'Total Revenue', // Cambié CPL por Revenue que sí tienes
          value: `$${n8nData.kpis.total_revenue}`,
          change: '+100%',
          changeType: 'increase',
          icon: 'user',
        },
      ],
      leadConversion: {
        totalLeads: n8nData.kpis.total_leads,
        totalLeadsChange: '+0%',
        mql: n8nData.funnel.find((f: any) => f.stage === 'Oportunidades')?.value || 0,
        mqlChange: '0%',
        conversionRate: n8nData.kpis.conversion_rate,
        conversionRateTarget: 5.0,
        // Mockeamos la gráfica histórica por ahora
        chartData: [
          { date: 'Jan', value: 10 },
          { date: 'Feb', value: 15 },
          { date: 'Mar', value: n8nData.kpis.total_leads }, // El último es real
        ],
      },
      funnelPerformance: n8nData.funnel.map((f: any) => ({
        stage: f.stage,
        value: f.value.toString(),
        meta: 'Active',
        change: '0%',
        changeType: 'neutral'
      })),
      // Mapeamos el reporte de IA de Gemini
      aiForecast: {
        title: n8nData.intelligenceReport.analysis.key_insight,
        description: n8nData.intelligenceReport.analysis.actionable_recommendation,
        sentiment: n8nData.intelligenceReport.analysis.sentiment
      },
      // Usamos tus productos reales
      productPerformance: n8nData.products.map((p: any) => ({
        name: p.name,
        sku: 'SKU-GEN', // GHL a veces no da SKU fácil
        revenue: '$0', // GHL API simple no da revenue por producto fácil
        change: p.status === 'alert' ? 'Low Stock' : 'In Stock',
        changeType: p.status === 'alert' ? 'decrease' : 'increase',
        image: 'product-watch' // Placeholder
      })),
      salesByChannel: [
        { name: 'GHL Source', value: n8nData.kpis.total_revenue }
      ]
    };

  } catch (error) {
    console.error("Error loading dashboard:", error);
    // Retornar datos vacíos o mock en caso de error
    return null; 
  }
};