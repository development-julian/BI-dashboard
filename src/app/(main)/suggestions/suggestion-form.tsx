'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { suggestDashboardThemes } from '@/ai/flows/suggest-dashboard-themes';
import type { SuggestDashboardThemesOutput } from '@/ai/flows/suggest-dashboard-themes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function SuggestionForm() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestDashboardThemesOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
        toast({
            title: "Input required",
            description: "Please describe your business or data.",
            variant: "destructive",
        });
        return;
    }

    setLoading(true);
    setSuggestions(null);

    try {
      const result = await suggestDashboardThemes({ userInput });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to get suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g., I'm building a dashboard for a social media analytics platform..."
          rows={4}
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className='w-full sm:w-auto'>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Get Suggestions'
          )}
        </Button>
      </form>

      {suggestions && (
        <div className="space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Suggested Themes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {suggestions.themeSuggestions.map((theme, index) => (
                <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                  {theme}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Suggested Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {suggestions.metricSuggestions.map((metric, index) => (
                <Badge key={index} variant="outline" className="text-base px-3 py-1">
                  {metric}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
