'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Bot } from 'lucide-react';

interface AiInsightCardProps {
  loading: boolean;
  report?: { analysis: string; sentiment: string; };
  error?: string | null;
}

export default function AiInsightCard({ loading, report, error }: AiInsightCardProps) {
  const reportText = typeof report === 'string' ? report : report?.analysis;

  return (
    <Card className="col-span-1 lg:col-span-7 animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bot />
          AI-Powered Analysis
        </CardTitle>
        <CardDescription>
          Your personal data analyst, providing deeper insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reportText}</p>
        )}
      </CardContent>
    </Card>
  );
}
