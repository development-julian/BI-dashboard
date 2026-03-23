/* ======================================================
   PROCESS & NORMALIZE DATA (GHL + Date Filter + Social)
   Version: 5.0 (Flattened for Recharts + COP$ Filter)
====================================================== */

// --- 1. CONFIGURACIÓN Y INPUTS (FECHAS) ---
let dateFrom = '2000-01-01'; 
let dateTo = '2100-01-01';

try {
    const triggerData = $('When Executed by Another Workflow').first().json;
    const input = triggerData.json || triggerData; 
    
    if (input.dateRange) {
        dateFrom = input.dateRange.from || dateFrom;
        dateTo = input.dateRange.to || dateTo;
    } else if (input.dateFrom) {
        dateFrom = input.dateFrom;
        dateTo = input.dateTo;
    }
} catch (e) {
    console.log("No date input found, using defaults");
}

const fromMs = new Date(dateFrom).getTime();
const toMs = new Date(dateTo).getTime();

// --- 2. OBTENCIÓN DE DATOS GHL ---
const opportunities = $('HTTP: Get Opportunities').all().map(i => i.json.opportunities || []).flat();

const mockNode = $('Mock Sales by Channel');
if (mockNode && mockNode.length > 0) {
    const mockOpps = mockNode.first().json.opportunities || [];
    opportunities.push(...mockOpps);
}

// Order by date to keep chronologically coherent
opportunities.sort((a,b) => new Date(a.dateWon || a.createdAt) - new Date(b.dateWon || b.createdAt));

const contacts = $('HTTP: Get Contacts').all().map(i => i.json.contacts || []).flat();
const pipelines = $('HTTP: Get Pipelines').first().json.pipelines || [];

let socialStats = { totalReach: 0, totalImpressions: 0 };
try {
    const socialNode = $('HTTP: Get Social Stats');
    if (socialNode) socialStats = socialNode.first().json || socialStats;
} catch (e) {}

// --- 3. MAPEAR Y ORDENAR STAGES ---
const stageMap = {};
const activePipeline = pipelines[0] || { stages: [] }; 
const orderedStages = (activePipeline.stages || []).sort((a, b) => a.position - b.position);

orderedStages.forEach(stage => {
    stageMap[stage.id] = stage.name;
});

// --- 4. PROCESAR OPORTUNIDADES ---
let totalRevenue = 0;
let wonDeals = 0;
const funnelCount = {}; 
const revenueTrend = {};
let filteredOpps = 0;

const oppSources = {};
const pipelineValues = {};
const clusterDataChart = [];

opportunities.forEach(opp => {
    const dateStr = (opp.dateWon || opp.createdAt || "");
    const oppDateMs = new Date(dateStr).getTime();

    if (oppDateMs < fromMs || oppDateMs > toMs) return;
    
    filteredOpps++;
    const stageName = stageMap[opp.pipelineStageId] || "Unknown Stage";
    funnelCount[stageName] = (funnelCount[stageName] || 0) + 1;
    
    const value = Number(opp.monetaryValue || 0);
    pipelineValues[stageName] = (pipelineValues[stageName] || 0) + value;

    if (opp.status === "won") {
        wonDeals++;
        totalRevenue += value;
        const simpleDate = dateStr.split("T")[0] || "Unknown Date";
        revenueTrend[simpleDate] = (revenueTrend[simpleDate] || 0) + value;
    }
    
    let source = opp.source || "Direct";
    if (source.length > 20) source = source.substring(0, 20) + "...";
    
    if (!oppSources[source]) {
        oppSources[source] = { won: 0, total: 0, revenue: 0 };
    }
    oppSources[source].total++;
    if (opp.status === "won") {
        oppSources[source].won++;
        oppSources[source].revenue += value;
    }
    
    const contact = contacts.find(c => c.id === opp.contactId) || {};
    const tagsCount = Array.isArray(contact.tags) ? contact.tags.length : 0;
    const xEngagement = Math.min(100, Math.max(1, (tagsCount * 10) + (opp.status === "won" ? 40 : 10)));

    clusterDataChart.push({
        id: opp.id || `opp_${Math.random()}`,
        x_engagement: xEngagement,
        y_value: value,
        category: source,
        status: opp.status || "open"
    });
});

const winRateBySourceChart = Object.entries(oppSources).map(([source, data]) => ({
    source: source,
    win_rate: data.total > 0 ? Number(((data.won / data.total) * 100).toFixed(1)) : 0,
    total_revenue: data.revenue,
    roi: data.total > 0 ? Number(((data.revenue / (data.total * 50)) * 100).toFixed(0)) : 0
})).sort((a, b) => b.total_revenue - a.total_revenue);

const pipelineValueChart = Object.entries(pipelineValues).map(([stage, v]) => ({
    stage,
    value: v
}));

// --- 5. PROCESAR CONTACTOS ---
const leadSources = {};
let filteredContacts = 0;

contacts.forEach(contact => {
    const dateAddedMs = new Date(contact.dateAdded).getTime();
    if (dateAddedMs < fromMs || dateAddedMs > toMs) return;
    filteredContacts++;
    
    let source = contact.source || "Direct";
    source = source.length > 20 ? source.substring(0, 20) + "..." : source; 
    leadSources[source] = (leadSources[source] || 0) + 1;
});

const leadsByDay = {};
contacts.forEach(contact => {
    const dateAddedMs = new Date(contact.dateAdded).getTime();
    if (dateAddedMs < fromMs || dateAddedMs > toMs) return;
    const day = contact.dateAdded.split("T")[0];
    leadsByDay[day] = (leadsByDay[day] || 0) + 1;
});

const leadsChartData = Object.entries(leadsByDay)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, value]) => ({ date, value }));

// --- 5.2 MONTHLY SALES BY CHANNEL (DYNAMIC FROM OPPORTUNITIES) ---
let leadConversionTrendsMap = {};

opportunities.forEach(opp => {
    if (opp.status !== 'won') return;
    const dateStr = opp.dateWon || opp.createdAt || "";
    if (!dateStr) return;
    
    const dateObj = new Date(dateStr);
    const ms = dateObj.getTime();
    if (ms < fromMs || ms > toMs) return;

    const monthNames = {0:'ENE',1:'FEB',2:'MAR',3:'ABR',4:'MAY',5:'JUN',6:'JUL',7:'AGO',8:'SEPT',9:'OCT',10:'NOV',11:'DIC'};
    const monthName = monthNames[dateObj.getUTCMonth()];
    const yearStr = String(dateObj.getUTCFullYear()).slice(-2);
    const key = `${monthName}_${yearStr}`;

    const source = opp.source || "Direct";
    const value = Number(opp.monetaryValue || 0);

    if (!leadConversionTrendsMap[key]) {
        leadConversionTrendsMap[key] = {};
    }
    leadConversionTrendsMap[key][source] = (leadConversionTrendsMap[key][source] || 0) + value;
});

// 6. ORDENAR Y APLANAR (FLATTEN) PARA NEXT.JS
const monthOrder = { 'ENE': 1, 'FEB': 2, 'MAR': 3, 'ABR': 4, 'MAY': 5, 'JUN': 6, 'JUL': 7, 'AGO': 8, 'SEPT': 9, 'OCT': 10, 'NOV': 11, 'DIC': 12 };

const leadConversionTrends = Object.keys(leadConversionTrendsMap).map(month => {
    const parts = month.split('_');
    const sortKey = (parseInt(parts[1] || 0) * 100) + (monthOrder[parts[0]] || 0);

    return {
        date: month, 
        ...leadConversionTrendsMap[month], 
        _sortKey: sortKey
    };
}).sort((a, b) => a._sortKey - b._sortKey).map(item => {
    delete item._sortKey; 
    return item;
});

// --- 7. FORMATEAR OTROS GRÁFICOS ---
const salesFunnel = orderedStages.map((stage, index) => {
    const currentCount = funnelCount[stage.name] || 0;
    let prevCount = index > 0 ? funnelCount[orderedStages[index - 1].name] || 0 : 0;
    let dropOff = prevCount > 0 ? ((prevCount - currentCount) / prevCount) * 100 : 0;

    return {
        stage: stage.name,
        value: currentCount,
        previous_value: prevCount,
        drop_off_percentage: Number(Math.max(0, dropOff).toFixed(1))
    };
});

const leadsBySource = Object.entries(leadSources)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

const revenueTrendChart = Object.entries(revenueTrend).map(([date, value]) => ({ date, value }));

// --- 8. RETORNO FINAL ---
return [
    {
        json: {
            kpis: {
                total_revenue: totalRevenue,
                total_leads: filteredContacts,
                leads_chart_status: "ok", 
                average_ticket: wonDeals > 0 ? Number((totalRevenue / wonDeals).toFixed(2)) : 0,
                conversion_rate: filteredOpps ? Number(((wonDeals / filteredOpps) * 100).toFixed(2)) : 0,
                won_deals: wonDeals,
                social_reach: socialStats.totalReach || 0,
                social_impressions: socialStats.totalImpressions || 0
            },
            charts: {
                sales_funnel: salesFunnel, 
                leads_by_source: leadsBySource,
                revenue_trend: revenueTrendChart,
                leads_chart_data: leadsChartData,
                lead_conversion_trends: leadConversionTrends,
                win_rate_by_source: winRateBySourceChart,
                cluster_data: clusterDataChart,
                pipeline_value_by_stage: pipelineValueChart
            },
            raw_summary_for_ai: {
                top_source: leadsBySource[0]?.label || "N/A",
                worst_funnel_stage: salesFunnel.sort((a, b) => b.drop_off_percentage - a.drop_off_percentage)[0]?.stage || "N/A"
            }
        }
    }
];
