'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { createInvoiceWithRiskAssessment, type FormState } from '@/lib/actions';
import { Badge } from '../ui/badge';

const FormSchema = z.object({
  payerName: z.string().min(2, 'Payer name is required.'),
  payerEmail: z.string().email('Invalid email address.'),
  invoiceAmount: z.coerce
    .number()
    .positive('Amount must be a positive number.'),
  invoiceDueDate: z.date(),
  invoiceIssueDate: z.date(),
  payerHistory: z
    .string()
    .min(20, 'Please provide a more detailed payer history.'),
  industryTrends: z
    .string()
    .min(20, 'Please provide more details on industry trends.'),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Assessing Risk...
        </>
      ) : (
        'Create Invoice & Assess Risk'
      )}
    </Button>
  );
}

export function UploadForm() {
  const initialState: FormState = { message: '' };
  const [formState, formAction] = useFormState(
    createInvoiceWithRiskAssessment,
    initialState
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      payerName: '',
      payerEmail: '',
      invoiceAmount: 0,
      payerHistory: '',
      industryTrends: '',
    },
  });

  function getRiskBadgeVariant(riskScore?: number) {
    if (riskScore === undefined) return 'bg-gray-500/20';
    if (riskScore < 0.3) return 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400';
    if (riskScore < 0.6) return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400';
    return 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400';
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Form {...form}>
        <form
          action={formAction}
          className="space-y-6 md:col-span-2"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="payerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Innovate Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payer Email</FormLabel>
                  <FormControl>
                    <Input placeholder="billing@innovate.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="invoiceAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="invoiceIssueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Issue Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceDueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="payerHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payer Payment History</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Consistent on-time payments for the last 2 years..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the payer&apos;s payment record.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industryTrends"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Trends</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., The tech sector is currently experiencing steady growth..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe relevant trends in the payer&apos;s industry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton />
        </form>
      </Form>
      <div className="md:col-span-1">
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent"/>
                    <span>AI Risk Assessment</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {formState.message.startsWith('Success') && formState.data ? (
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Risk Score</span>
                            <Badge className={cn("text-lg border-none", getRiskBadgeVariant(formState.data.riskScore))} variant="outline">
                                {formState.data.riskScore.toFixed(2)}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Assessment</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{formState.data.riskAssessment}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>Your invoice&apos;s risk assessment will appear here after submission.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
