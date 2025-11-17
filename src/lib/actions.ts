'use server';

import { z } from 'zod';
import { assessInvoiceRisk } from '@/ai/flows/assess-invoice-risk';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  payerName: z.string().min(2, {
    message: 'Payer name must be at least 2 characters.',
  }),
  payerEmail: z.string().email(),
  invoiceAmount: z.coerce.number().positive({
    message: 'Amount must be a positive number.',
  }),
  invoiceDueDate: z.date(),
  invoiceIssueDate: z.date(),
  payerHistory: z.string().min(10, {
    message: 'Payer history must be at least 10 characters.',
  }),
  industryTrends: z.string().min(10, {
    message: 'Industry trends must be at least 10 characters.',
  }),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: {
    riskScore: number;
    riskAssessment: string;
  };
};

export async function createInvoiceWithRiskAssessment(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    payerName: formData.get('payerName'),
    payerEmail: formData.get('payerEmail'),
    invoiceAmount: formData.get('invoiceAmount'),
    invoiceDueDate: new Date(formData.get('invoiceDueDate') as string),
    invoiceIssueDate: new Date(formData.get('invoiceIssueDate') as string),
    payerHistory: formData.get('payerHistory'),
    industryTrends: formData.get('industryTrends'),
  });

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key]?.[0] ?? "";
    }
    return {
      message: 'Error: Invalid form data.',
      fields: fields
    };
  }
  
  const {
    invoiceAmount,
    invoiceDueDate,
    invoiceIssueDate,
    payerHistory,
    industryTrends,
  } = validatedFields.data;

  try {
    const riskData = await assessInvoiceRisk({
      invoiceAmount,
      invoiceDueDate: invoiceDueDate.toISOString().split('T')[0],
      invoiceIssueDate: invoiceIssueDate.toISOString().split('T')[0],
      payerHistory,
      industryTrends,
    });

    // In a real app, you would save the invoice and risk data to a database here.
    console.log('Invoice created with risk assessment:', {
      ...validatedFields.data,
      ...riskData,
    });

    // Revalidate paths to update data on dashboard and marketplace
    revalidatePath('/dashboard');
    revalidatePath('/marketplace');

    return {
      message: 'Success! Invoice created and risk assessed.',
      data: riskData,
    };
  } catch (error) {
    console.error('Error assessing invoice risk:', error);
    return {
      message: 'Error: Could not assess invoice risk. Please try again.',
    };
  }
}
