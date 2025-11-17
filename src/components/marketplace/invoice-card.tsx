import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Invoice } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CalendarIcon, DollarSignIcon } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
}

function getRiskBadgeVariant(riskScore: number) {
  if (riskScore < 0.3) return 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400';
  if (riskScore < 0.6) return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400';
  return 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400';
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const expectedReturn = invoice.amount * 1.05; // Example calculation
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl">{invoice.payerName}</CardTitle>
            <CardDescription>INV-{invoice.invoiceNumber}</CardDescription>
          </div>
          <Badge className={cn("border-none text-xs", getRiskBadgeVariant(invoice.riskScore ?? 0.5))} variant="outline">
            Risk: {(invoice.riskScore ?? 0.5).toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {invoice.riskAssessment}
        </p>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div className="flex items-center gap-2">
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium">${invoice.amount.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{invoice.dueDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex-col items-stretch gap-2 rounded-b-lg">
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expected Return</span>
            <span className="font-medium">${expectedReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <Button className="w-full">Purchase Invoice</Button>
      </CardFooter>
    </Card>
  );
}
