'use server';

/**
 * @fileOverview This file defines a Genkit flow for assessing the risk of an invoice using AI.
 *
 * It includes:
 * - `assessInvoiceRisk`:  The main function to assess invoice risk.
 * - `AssessInvoiceRiskInput`:  The expected input schema for the risk assessment.
 * - `AssessInvoiceRiskOutput`:  The output schema, including the risk score and assessment.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessInvoiceRiskInputSchema = z.object({
  payerHistory: z
    .string()
    .describe('Detailed payment history of the invoice payer.'),
  industryTrends: z
    .string()
    .describe('Current financial trends in the payer’s industry.'),
  invoiceAmount: z.number().describe('The total amount of the invoice.'),
  invoiceDueDate: z.string().describe('The due date of the invoice (YYYY-MM-DD).'),
  invoiceIssueDate: z.string().describe('The issue date of the invoice (YYYY-MM-DD).'),
});
export type AssessInvoiceRiskInput = z.infer<typeof AssessInvoiceRiskInputSchema>;

const AssessInvoiceRiskOutputSchema = z.object({
  riskScore: z
    .number()
    .describe(
      'A risk score between 0 and 1, where 0 is lowest risk and 1 is highest risk.'
    ),
  riskAssessment: z
    .string()
    .describe(
      'A detailed assessment of the invoice risk, including reasons for the assigned score.'
    ),
});
export type AssessInvoiceRiskOutput = z.infer<typeof AssessInvoiceRiskOutputSchema>;

export async function assessInvoiceRisk(input: AssessInvoiceRiskInput): Promise<AssessInvoiceRiskOutput> {
  return assessInvoiceRiskFlow(input);
}

const assessInvoiceRiskPrompt = ai.definePrompt({
  name: 'assessInvoiceRiskPrompt',
  input: {schema: AssessInvoiceRiskInputSchema},
  output: {schema: AssessInvoiceRiskOutputSchema},
  prompt: `You are an AI assistant specialized in assessing the financial risk of invoices for small and medium enterprises (SMEs).

  Based on the provided payer history, industry trends, invoice amount, due date and issue date, generate a risk score between 0 and 1 (where 0 is lowest risk and 1 is highest risk) and provide a detailed risk assessment.

  Payer History: {{{payerHistory}}}
  Industry Trends: {{{industryTrends}}}
  Invoice Amount: {{{invoiceAmount}}}
  Invoice Due Date: {{{invoiceDueDate}}}
  Invoice Issue Date: {{{invoiceIssueDate}}}

  Provide the risk score and assessment in the following JSON format:
  { 
    "riskScore": 0.5,
    "riskAssessment": "The invoice risk is moderate due to..."
  }
  `,
});

const assessInvoiceRiskFlow = ai.defineFlow(
  {
    name: 'assessInvoiceRiskFlow',
    inputSchema: AssessInvoiceRiskInputSchema,
    outputSchema: AssessInvoiceRiskOutputSchema,
  },
  async input => {
    const {output} = await assessInvoiceRiskPrompt(input);
    return output!;
  }
);
