'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface FunnelData {
  stage: string;
  count: number;
}

// Classic funnel colors matching the reference: blue→orange→gray→amber→green
const FUNNEL_COLORS = [
  '#4285F4', // Blue
  '#F4A236', // Orange
  '#A4A4A4', // Gray
  '#FBBC04', // Amber/Yellow
  '#34A853', // Green
];

export default function FunnelPerformance({ data }: { data: FunnelData[] }) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Sales Funnel</CardTitle>
          <CardDescription>Opportunity progression count by stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
            No funnel data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="font-headline">Sales Funnel</CardTitle>
        <CardDescription>Opportunity progression count by stage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-1 py-4">
          {data.map((stage, index) => {
            // Each layer gets progressively narrower, creating the funnel shape
            const widthPercentage = 100 - (index * (60 / Math.max(data.length - 1, 1)));
            const color = FUNNEL_COLORS[index % FUNNEL_COLORS.length];

            return (
              <div
                key={stage.stage}
                className="relative group transition-all duration-300 hover:scale-[1.02]"
                style={{
                  width: `${widthPercentage}%`,
                  minHeight: '48px',
                }}
              >
                {/* Trapezoid shape using clip-path */}
                <div
                  className="w-full h-full flex items-center justify-center rounded-sm"
                  style={{
                    backgroundColor: color,
                    clipPath: index < data.length - 1
                      ? `polygon(${3 + index * 1.5}% 0%, ${97 - index * 1.5}% 0%, ${100 - index * 0.5}% 100%, ${index * 0.5}% 100%)`
                      : `polygon(${3 + index * 1.5}% 0%, ${97 - index * 1.5}% 0%, ${85}% 100%, ${15}% 100%)`,
                    minHeight: '48px',
                  }}
                >
                  <div className="flex flex-col items-center z-10 py-2">
                    <span className="text-sm font-bold text-white drop-shadow-md">
                      {stage.stage}
                    </span>
                    <span className="text-xs font-semibold text-white/90 drop-shadow-md">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full
                  hidden group-hover:block bg-popover text-popover-foreground
                  text-xs px-3 py-1.5 rounded-md shadow-lg border border-border
                  whitespace-nowrap z-20">
                  {stage.stage}: {stage.count.toLocaleString()} leads
                  {maxCount > 0 && (
                    <span className="ml-1 text-muted-foreground">
                      ({Math.round((stage.count / maxCount) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
