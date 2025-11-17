import {
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Invoice, mockInvoices } from '@/lib/data';
import { cn } from '@/lib/utils';

function getRiskBadgeVariant(riskScore: number) {
  if (riskScore < 0.3) return 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400';
  if (riskScore < 0.6) return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400';
  return 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400';
}

function getStatusBadgeVariant(status: Invoice['status']) {
  switch (status) {
    case 'Paid':
      return 'bg-blue-500/20 text-primary hover:bg-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400';
    case 'Funded':
      return 'bg-purple-500/20 text-accent-foreground hover:bg-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400';
    case 'Pending':
    default:
      return 'bg-gray-500/20 text-muted-foreground hover:bg-gray-500/30 dark:bg-gray-500/10 dark:text-gray-400';
  }
}

export function InvoicesTable() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            A list of your most recent invoices.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/marketplace">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Risk</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.slice(0, 5).map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="font-medium">{invoice.payerName}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {invoice.payerEmail}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className={cn("border-none", getStatusBadgeVariant(invoice.status))} variant="outline">
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                   <Badge className={cn("border-none", getRiskBadgeVariant(invoice.riskScore ?? 0.5))} variant="outline">
                    {(invoice.riskScore ?? 0.5).toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {invoice.dueDate}
                </TableCell>
                <TableCell className="text-right">
                  ${invoice.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
