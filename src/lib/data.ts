// This file contains synthetic data for the dashboard components.
// In a real application, this data would be fetched from a backend API or Firestore.

export const mockKpiData = [
  {
    label: 'Ad Spend',
    value: '$4,250.00',
    change: '+5.2%',
    changeType: 'increase',
    icon: 'dollar',
  },
  {
    label: 'ROAS',
    value: '4.2x',
    change: '-2.1%',
    changeType: 'decrease',
    icon: 'percent',
  },
  {
    label: 'CPL',
    value: '$12.50',
    change: '-12% (Better)',
    changeType: 'increase',
    icon: 'user',
  },
];

export const mockLeadConversionData = {
  totalLeads: 1248,
  totalLeadsChange: '+14%',
  mql: 856,
  mqlChange: '+8%',
  conversionRate: 4.2,
  conversionRateTarget: 5.0,
  chartData: [
    { date: 'Jan', value: 210 },
    { date: 'Feb', value: 250 },
    { date: 'Mar', value: 310 },
    { date: 'Apr', value: 280 },
    { date: 'May', value: 350 },
    { date: 'Jun', value: 420 },
  ],
};

export const mockFunnelPerformance = [
  {
    stage: 'Impressions',
    value: '45.2k',
    meta: 'Reach: 32.1k users',
    change: 'Top',
    changeType: 'neutral',
  },
  {
    stage: 'Clicks',
    value: '3,120',
    meta: 'CPC: $1.36 avg',
    change: '6.9%',
    changeType: 'decrease',
  },
  {
    stage: 'Leads',
    value: '245',
    meta: 'CPL: $17.34',
    change: '7.8%',
    changeType: 'decrease',
  },
  {
    stage: 'Sales',
    value: '18',
    meta: 'CAC: $236.11',
    change: '320% ROI',
    changeType: 'increase',
  },
];

export const mockSalesByChannel = [
  { name: 'Social', value: 18000 },
  { name: 'Organic', value: 10200 },
  { name: 'Referral', value: 6500 },
];

export const mockProductPerformance = [
  {
    name: 'Smart Watch X',
    sku: 'SW-2024',
    revenue: '$12,450',
    change: '+18%',
    changeType: 'increase',
    image: 'product-watch',
  },
  {
    name: 'Earbuds Pro',
    sku: 'EP-100',
    revenue: '$8,920',
    change: '-4%',
    changeType: 'decrease',
    image: 'product-earbuds',
  },
  {
    name: 'Yoga Mat',
    sku: 'YM-550',
    revenue: '$4,230',
    change: '+8.5%',
    changeType: 'increase',
    image: 'product-mat',
  },
];
