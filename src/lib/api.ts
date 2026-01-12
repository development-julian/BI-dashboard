'use server';

// In a real application, this is where you would fetch data from your backend.
// For this MVP, we're using static mock data.
// Later, this could be replaced with calls to a Firebase Firestore collection `dashboard_stats`.

import {
  mockKpiData,
  mockLeadConversionData,
  mockSalesByChannel,
  mockFunnelPerformance,
  mockProductPerformance,
} from './data';

export interface KpiCard {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: 'dollar' | 'percent' | 'user';
}

export interface ChartData {
  date: string;
  [key: string]: any;
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
  changeType: 'increase' | 'decrease';
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
    chartData: ChartData[];
  };
  funnelPerformance: FunnelStage[];
  salesByChannel: { name: string; value: number }[];
  productPerformance: ProductPerformance[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real implementation, you would fetch this from Firestore
  // e.g., const docSnap = await getDoc(doc(db, "dashboard_stats", "latest"));
  // if (docSnap.exists()) { return docSnap.data() as DashboardStats; }

  return {
    kpis: mockKpiData,
    leadConversion: mockLeadConversionData,
    funnelPerformance: mockFunnelPerformance,
    salesByChannel: mockSalesByChannel,
    productPerformance: mockProductPerformance,
  };
};
