export const kpiData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'increase',
    description: 'from last month',
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1%',
    changeType: 'increase',
    description: 'from last month',
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19%',
    changeType: 'increase',
    description: 'from last month',
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '-2.1%',
    changeType: 'decrease',
    description: 'from last hour',
  },
];

export const lineChartData = [
  { date: 'Jan 22', desktop: 186, mobile: 80 },
  { date: 'Feb 22', desktop: 305, mobile: 200 },
  { date: 'Mar 22', desktop: 237, mobile: 120 },
  { date: 'Apr 22', desktop: 73, mobile: 190 },
  { date: 'May 22', desktop: 209, mobile: 130 },
  { date: 'Jun 22', desktop: 214, mobile: 140 },
];

export const barChartData = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

export type Transaction = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
    date: string;
};

export const tableData: Transaction[] = [
    { id: 'TRX001', amount: 320.00, status: 'success', email: 'ken.t@example.com', date: '2023-06-23' },
    { id: 'TRX002', amount: 198.50, status: 'processing', email: 'a.h@example.com', date: '2023-06-24' },
    { id: 'TRX003', amount: 50.00, status: 'failed', email: 'm.j@example.com', date: '2023-06-25' },
    { id: 'TRX004', amount: 675.00, status: 'success', email: 's.lee@example.com', date: '2023-06-26' },
    { id: 'TRX005', amount: 89.99, status: 'pending', email: 'p.w@example.com', date: '2023-06-27' },
    { id: 'TRX006', amount: 1200.00, status: 'success', email: 'l.c@example.com', date: '2023-06-28' },
    { id: 'TRX007', amount: 45.50, status: 'processing', email: 'j.d@example.com', date: '2023-06-29' },
    { id: 'TRX008', amount: 250.00, status: 'success', email: 'k.b@example.com', date: '2023-06-30' },
    { id: 'TRX009', amount: 300.00, status: 'failed', email: 'e.g@example.com', date: '2023-07-01' },
    { id: 'TRX010', amount: 75.00, status: 'pending', email: 'n.r@example.com', date: '2023-07-02' },
];
