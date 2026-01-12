'use client';

import { WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiForecast() {
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
            AI FORECAST
          </h2>
          <p className="mt-1 text-2xl font-bold text-white">
            Stock Alert: Product A
          </p>
          <p className="max-w-xl text-sm text-primary-foreground/80">
            Inventory expected to deplete by <span className="font-semibold text-white">Oct 12th</span> based on current sales velocity.
            Increasing daily ad spend by <span className="font-semibold text-white">$200</span> is recommended to capitalize on demand before stock-out.
          </p>
        </div>
        <Button
          variant="secondary"
          className="bg-white text-primary-foreground hover:bg-white/90 shrink-0"
        >
          Restock Now &rarr;
        </Button>
      </div>
    </div>
  );
}
