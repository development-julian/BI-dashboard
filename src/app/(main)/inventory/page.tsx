import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InventoryPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline">Sales & Inventory</CardTitle>
                    <CardDescription>This page is under construction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Check back soon for detailed sales and inventory data!</p>
                </CardContent>
            </Card>
        </div>
    )
}
