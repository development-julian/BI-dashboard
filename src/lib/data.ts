export const kpiData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'increase' as 'increase' | 'decrease',
    description: 'Total revenue from all sales channels.',
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1%',
    changeType: 'increase' as 'increase' | 'decrease',
    description: 'New subscribers this month.',
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19%',
    changeType: 'increase' as 'increase' | 'decrease',
    description: 'Total sales this month.',
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '+201',
    changeType: 'increase' as 'increase' | 'decrease',
    description: 'Users currently active on the platform.',
  },
];

export const barChartData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];

export const lineChartData = [
    { name: 'Jan', desktop: 186, mobile: 80 },
    { name: 'Feb', desktop: 305, mobile: 200 },
    { name: 'Mar', desktop: 237, mobile: 120 },
    { name: 'Apr', desktop: 73, mobile: 190 },
    { name: 'May', desktop: 209, mobile: 130 },
    { name: 'Jun', desktop: 214, mobile: 140 },
    { name: 'Jul', desktop: 345, mobile: 220 },
    { name: 'Aug', desktop: 289, mobile: 180 },
    { name: 'Sep', desktop: 402, mobile: 250 },
    { name: 'Oct', desktop: 367, mobile: 210 },
    { name: 'Nov', desktop: 488, mobile: 300 },
    { name: 'Dec', desktop: 521, mobile: 320 },
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
    { id: 'TXN006', email: 'liam.brown@email.com', amount: 200.0, date: '2023-08-06', status: 'success' },
    { id: 'TXN007', email: 'ava.jones@email.com', amount: 300.25, date: '2023-08-07', status: 'pending' },
    { id: 'TXN008', email: 'noah.garcia@email.com', amount: 100.0, date: '2023-08-08', status: 'success' },
    { id: 'TXN009', email: 'emma.miller@email.com', amount: 180.0, date: '2023-08-09', status: 'failed' },
    { id: 'TXN010', email: 'james.wilson@email.com', amount: 275.0, date: '2023-08-10', status: 'success' },
];

export const analysisReport = {
  summary: "The analysis indicates a positive trend in user engagement and revenue. Key drivers include a recent marketing campaign and new feature launches.",
  key_insight: "Mobile adoption is lagging behind desktop, suggesting a need for improved mobile user experience.",
  actionable_recommendation: "Invest in a mobile-first redesign and targeted mobile ad campaigns to boost engagement."
};
