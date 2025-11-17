'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'February', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'March', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'April', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'June', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'July', total: Math.floor(Math.random() * 5000) + 1000 },
];

const chartConfig = {
  total: {
    label: 'Total',
    color: 'hsl(var(--primary))',
  },
};

export function RevenueChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Invoice Overview</CardTitle>
        <CardDescription>
          An overview of your invoice values for the last 7 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
               <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
