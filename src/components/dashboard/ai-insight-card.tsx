'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Bot, Lightbulb, TrendingUp } from 'lucide-react';

interface Report {
  summary: string;
  key_insight: string;
  actionable_recommendation: string;
}

interface AiInsightCardProps {
  loading: boolean;
  report?: Report;
  error?: string | null;
}

export default function AiInsightCard({ loading, report, error }: AiInsightCardProps) {

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
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : report ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                Summary
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                <Lightbulb className="text-yellow-500" />
                Key Insight
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.key_insight}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                <TrendingUp className="text-green-500" />
                Actionable Recommendation
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.actionable_recommendation}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
