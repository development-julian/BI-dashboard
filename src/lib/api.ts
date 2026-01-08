'use server';

import { kpiData, barChartData, lineChartData, analysisReport } from "./data";

const API_URL = 'https://growtzy-dev1.app.n8n.cloud/webhook/api/v1/gateway';

const defaultBody = {
  ghlLocationId: 'demo_location_id',
  userToken: 'demo_token',
  dateRange: {
    from: '2024-01-01',
    to: '2024-01-31',
  },
};

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
}

export interface ChartData {
  name: string;
  total?: number;
  desktop?: number;
  mobile?: number;
}

export interface Chart {
  chartType: 'bar' | 'line';
  title: string;
  description?: string;
  data: ChartData[];
}

export interface DashboardData {
  kpis: Kpi[];
  charts: Chart[];
}

export interface AnalysisData {
  intelligenceReport: {
    summary: string;
    key_insight: string;
    actionable_recommendation: string;
  };
}

const fetchFromApi = async <T>(action: 'GET_DASHBOARD' | 'GET_ANALYSIS'): Promise<{ success: boolean; data?: T; message?: string }> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...defaultBody, action }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching ${action}:`, error);
    
    if (action === 'GET_DASHBOARD') {
      return {
        success: true,
        data: {
          kpis: kpiData,
          charts: [
            { chartType: 'bar', title: 'Overview', data: barChartData },
            { chartType: 'line', title: 'User Activity', description: 'Desktop vs. Mobile Users', data: lineChartData }
          ]
        } as unknown as T
      };
    }
    
    if (action === 'GET_ANALYSIS') {
      return {
        success: true,
        data: {
          intelligenceReport: analysisReport,
        } as unknown as T
      };
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};


export const getDashboardData = async (): Promise<{ success: boolean; data?: DashboardData; message?: string }> => {
  return fetchFromApi<DashboardData>('GET_DASHBOARD');
};

export const getAnalysisData = async (): Promise<{ success: boolean; data?: AnalysisData; message?: string }> => {
  return fetchFromApi<AnalysisData>('GET_ANALYSIS');
};
