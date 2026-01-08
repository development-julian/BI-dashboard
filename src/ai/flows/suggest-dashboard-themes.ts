'use server';

/**
 * @fileOverview Suggests dashboard themes and relevant metrics based on user input.
 *
 * - suggestDashboardThemes - A function that suggests dashboard themes and metrics.
 * - SuggestDashboardThemesInput - The input type for the suggestDashboardThemes function.
 * - SuggestDashboardThemesOutput - The return type for the suggestDashboardThemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDashboardThemesInputSchema = z.object({
  userInput: z
    .string()
    .describe('User input describing the desired dashboard or metrics.'),
});
export type SuggestDashboardThemesInput = z.infer<typeof SuggestDashboardThemesInputSchema>;

const SuggestDashboardThemesOutputSchema = z.object({
  themeSuggestions: z
    .array(z.string())
    .describe('Suggested dashboard themes based on user input.'),
  metricSuggestions: z
    .array(z.string())
    .describe('Suggested metrics relevant to the suggested dashboard themes.'),
});
export type SuggestDashboardThemesOutput = z.infer<typeof SuggestDashboardThemesOutputSchema>;

export async function suggestDashboardThemes(
  input: SuggestDashboardThemesInput
): Promise<SuggestDashboardThemesOutput> {
  return suggestDashboardThemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDashboardThemesPrompt',
  input: {schema: SuggestDashboardThemesInputSchema},
  output: {schema: SuggestDashboardThemesOutputSchema},
  prompt: `You are a dashboard theme and metric suggestion expert.

  Based on the user input, suggest dashboard themes and relevant metrics.

  User Input: {{{userInput}}}

  Format your response as a JSON object matching the following schema:
  ${JSON.stringify(SuggestDashboardThemesOutputSchema.shape, null, 2)}`,
});

const suggestDashboardThemesFlow = ai.defineFlow(
  {
    name: 'suggestDashboardThemesFlow',
    inputSchema: SuggestDashboardThemesInputSchema,
    outputSchema: SuggestDashboardThemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
