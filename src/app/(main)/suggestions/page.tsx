import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SuggestionForm } from './suggestion-form';

export default function SuggestionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
       <div>
        <h1 className="text-2xl font-headline font-bold">Dashboard Suggestions</h1>
        <p className="text-muted-foreground">
          Describe your business or data, and let AI suggest relevant themes and metrics for your dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className='font-headline'>Describe Your Needs</CardTitle>
            <CardDescription>
                For example: "I run an e-commerce store selling handmade jewelry."
            </CardDescription>
        </CardHeader>
        <CardContent>
            <SuggestionForm />
        </CardContent>
      </Card>
    </div>
  );
}
