'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DateRangeTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDateRangeChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('range', value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const defaultRange = searchParams.get('range') || '7d';

  return (
    <Tabs
      defaultValue={defaultRange}
      onValueChange={handleDateRangeChange}
      className="hidden md:block"
    >
      <TabsList>
        <TabsTrigger value="7d">7D</TabsTrigger>
        <TabsTrigger value="30d">30D</TabsTrigger>
        <TabsTrigger value="90d">90D</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
