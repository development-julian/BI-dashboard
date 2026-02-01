
import { getInventoryData, type InventoryData } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const stockStatusColors = {
    'In Stock': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Low Stock': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Out of Stock': 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const range = typeof searchParams?.range === 'string' ? searchParams.range : '30d';
  const result = await getInventoryData(range);

  if (!result || (result && 'error' in result)) {
    const error = result || { message: "Could not load inventory data.", type: 'Unknown' };
    return (
      <div className="flex h-[50vh] items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: {error.type}</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Sales & Inventory</CardTitle>
            <CardDescription>Overview of product stock levels and revenue performance.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Stock Status</TableHead>
                        <TableHead className="text-right">Stock Level</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result.products.map((product) => {
                        const productImage = PlaceHolderImages.find(p => p.id === product.image);
                        return (
                            <TableRow key={product.sku}>
                                <TableCell>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        {productImage ? (
                                            <Image
                                                src={productImage.imageUrl}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover"
                                                data-ai-hint={productImage.imageHint}
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-md bg-muted" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={cn(stockStatusColors[product.stockStatus])}>
                                        {product.stockStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">{product.stockLevel.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold">${product.revenue.toLocaleString()}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
