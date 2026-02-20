'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { FunnelStage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { ArrowDown, ArrowRight, ShoppingCart, Target, MousePointerClick, TrendingUp, UserCheck, BellRing } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
    Impressions: Target,
    Clicks: MousePointerClick,
    Leads: TrendingUp,
    Sales: ShoppingCart,
    Interested: Target,
    Purchased: ShoppingCart,
    'Follow-up': UserCheck,
    Reminder: BellRing,
}

export default function FunnelPerformance({ data }: { data: FunnelStage[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Funnel Performance</CardTitle>
        <Button variant="link" className="text-primary">
          View Detail
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {data.map((item, index) => {
             const Icon = iconMap[item.stage] || Target;
             const isLast = index === data.length - 1;
             const changeColor = item.changeType === 'increase' ? 'text-green-400' : 'text-red-400';

            return (
                <li key={item.stage} className="relative">
                    <div className='flex gap-4 items-start'>
                        <div className='flex flex-col items-center'>
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" />
                            </div>
                            {!isLast && (
                                <div className="mt-2 h-8 w-px bg-border" />
                            )}
                        </div>

                        <div className='flex-1'>
                            <div className='flex justify-between items-center'>
                                <p className="text-sm text-muted-foreground">{item.stage}</p>
                                 <span className={cn('text-xs font-semibold', changeColor)}>
                                    {item.change}
                                </span>
                            </div>
                            <p className="text-xl font-bold">{item.value}</p>
                            <p className="text-xs text-muted-foreground">{item.meta}</p>
                        </div>
                    </div>
                </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
