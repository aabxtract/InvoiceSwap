import { Activity, BarChart, CreditCard, DollarSign } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { InvoicesTable } from '@/components/dashboard/invoices-table';
import { mockInvoices } from '@/lib/data';

export default function DashboardPage() {
  const totalValue = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const activeInvoices = mockInvoices.filter(inv => inv.status === 'Pending' || inv.status === 'Funded').length;
  const avgRisk = mockInvoices.reduce((sum, inv) => sum + (inv.riskScore ?? 0), 0) / mockInvoices.length;

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <KpiCard
          title="Total Value Locked"
          value={`$${(totalValue / 1000).toFixed(1)}k`}
          description="Total value of all invoices"
          Icon={DollarSign}
        />
        <KpiCard
          title="Active Invoices"
          value={`+${activeInvoices}`}
          description="Invoices currently pending or funded"
          Icon={CreditCard}
        />
         <KpiCard
          title="Average Risk Score"
          value={avgRisk.toFixed(2)}
          description="Average risk across all invoices"
          Icon={Activity}
        />
        <KpiCard
          title="Monthly Volume"
          value="+12.5%"
          description="Compared to last month"
          Icon={BarChart}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <RevenueChart />
        <InvoicesTable />
      </div>
    </div>
  );
}
