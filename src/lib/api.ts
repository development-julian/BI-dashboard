'use server';

import {
  mockKpiData,
  mockLineChartData,
  mockBarChartData,
  mockPieChartData,
  mockFunnelData,
} from './data';

// This file simulates an API layer.
// In a real application, this is where you would fetch data from your n8n backend.
// Example: const API_URL = 'https://n8n.example.com/webhook/api/v1';

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

export interface ChartData {
  name: string;
  value?: number;
  leads?: number;
  conversions?: number;
}

export interface Chart {
  chartType: 'bar' | 'line' | 'pie';
  title: string;
  description?: string;
  data: ChartData[];
}

export interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardData {
  kpis: Kpi[];
  charts: Chart[];
  funnel: FunnelStage[];
}

// Placeholder function to simulate fetching dashboard data.
// Replace the mock data with actual API calls to your n8n endpoint.
export const getDashboardData = async (): Promise<DashboardData> => {
  console.log('Fetching dashboard data... (mocked)');
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real implementation, you would make a POST request here.
  // const response = await fetch(API_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ action: 'GET_DASHBOARD', ... }),
  // });
  // const data = await response.json();
  // return data.data;

  return {
    kpis: mockKpiData,
    charts: [
      {
        chartType: 'line',
        title: 'Performance Over Time',
        description: 'Leads and conversions in the last 6 months.',
        data: mockLineChartData,
      },
      {
        chartType: 'bar',
        title: 'Pipeline Stages',
        description: 'Current distribution of leads in the pipeline.',
        data: mockBarChartData,
      },
      {
        chartType: 'pie',
        title: 'Lead Sources',
        description: 'Distribution of leads by acquisition channel.',
        data: mockPieChartData,
      },
    ],
    funnel: mockFunnelData,
  };
};

// Placeholder for AI-driven actions
export const getAiInsights = async () => {
  console.log('Fetching AI insights... (mocked)');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    message: 'AI insights are not implemented yet.',
  };
};