'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductPerformance as ProductPerformanceType } from '@/lib/api';

interface ProductPerformanceProps {
  data: ProductPerformanceType[];
}

export default function ProductPerformance({ data }: ProductPerformanceProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Product Performance</CardTitle>
        <Button variant="link" className="text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {data.map((product) => {
            const isIncrease = product.changeType === 'increase';
            const productImage = PlaceHolderImages.find(p => p.id === product.image);

            return (
              <li key={product.sku} className="flex items-center gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {productImage && (
                    <Image
                      src={productImage.imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                      data-ai-hint={productImage.imageHint}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{product.revenue}</p>
                  <p className={cn('text-xs font-semibold', isIncrease ? 'text-green-500' : 'text-red-500')}>
                    {product.change}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
