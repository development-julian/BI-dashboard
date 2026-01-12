// This file contains synthetic data for the dashboard components.
// In a real application, this data would be fetched from a backend API.

export const mockKpiData = [
  {
    title: 'Leads Generated',
    value: '1,257',
    change: '15.2%',
    changeType: 'increase' as 'increase' | 'decrease',
  },
  {
    title: 'Conversion Rate',
    value: '28.4%',
    change: '3.1%',
    changeType: 'increase' as 'increase' | 'decrease',
  },
  {
    title: 'Pipeline Value',
    value: '$458,231',
    change: '5.8%',
    changeType: 'decrease' as 'increase' | 'decrease',
  },
  {
    title: 'Revenue',
    value: '$95,670',
    change: '21.3%',
    changeType: 'increase' as 'increase' | 'decrease',
  },
];

export const mockLineChartData = [
  { name: 'Jan', leads: 210, conversions: 50 },
  { name: 'Feb', leads: 250, conversions: 65 },
  { name: 'Mar', leads: 310, conversions: 80 },
  { name: 'Apr', leads: 280, conversions: 75 },
  { name: 'May', leads: 350, conversions: 95 },
  { name: 'Jun', leads: 420, conversions: 120 },
];

export const mockBarChartData = [
  { name: 'New', value: 450 },
  { name: 'Contacted', value: 320 },
  { name: 'Qualified', value: 210 },
  { name: 'Proposal', value: 150 },
];

export const mockPieChartData = [
  { name: 'Organic Search', value: 400 },
  { name: 'Social Media', value: 300 },
  { name: 'Referrals', value: 250 },
  { name: 'Paid Ads', value: 200 },
];

export const mockFunnelData = [
  { name: 'Lead', count: 1257, percentage: 100 },
  { name: 'Contacted', count: 980, percentage: 78 },
  { name: 'Qualified', count: 654, percentage: 52 },
  { name: 'Won', count: 352, percentage: 28 },
];

export type Transaction = {
  id: string;
  email: string;
  amount: number;
  date: string;
  status: 'pending' | 'success' | 'failed';
};

export const tableData: Transaction[] = [
    { id: 'TXN001', email: 'olivia.martin@email.com', amount: 250.0, date: '2023-08-01', status: 'success' },
    { id: 'TXN002', email: 'jackson.lee@email.com', amount: 150.75, date: '2023-08-02', status: 'pending' },
    { id: 'TXN003', email: 'isabella.nguyen@email.com', amount: 350.0, date: '2023-08-03', status: 'success' },
    { id: 'TXN004', email: 'william.kim@email.com', amount: 450.5, date: '2023-08-04', status: 'failed' },
    { id: 'TXN005', email: 'sofia.davis@email.com', amount: 550.0, date: '2023-08-05', status: 'success' },
];

export const lineChartData = [
    { name: 'Jan', desktop: 186, mobile: 80 },
    { name: 'Feb', desktop: 305, mobile: 200 },
    { name: 'Mar', desktop: 237, mobile: 120 },
    { name: 'Apr', desktop: 73, mobile: 190 },
    { name: 'May', desktop: 209, mobile: 130 },
    { name: 'Jun', desktop: 214, mobile: 140 },
];
