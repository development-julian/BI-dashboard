'use client';

import { WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiForecastProps {
  title: string;
  description: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export default function AiForecast({ title, description, sentiment }: AiForecastProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-primary/90 p-6 shadow-lg">
        <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/grid.svg')" }}
      ></div>
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-foreground">
            <WandSparkles className="h-5 w-5" />
            AI STRATEGIC COPILOT
          </h2>
          <p className="mt-1 text-2xl font-bold text-white">
            {title || "Analyzing data..."}
          </p>
          <p className="max-w-xl text-sm text-primary-foreground/80 mt-2">
            {description || "Waiting for Gemini insights..."}
          </p>
        </div>
        <Button
          variant="secondary"
          className="bg-white text-primary hover:bg-white/90 shrink-0"
        >
          View Action Plan &rarr;
        </Button>
      </div>
    </div>
  );
}
