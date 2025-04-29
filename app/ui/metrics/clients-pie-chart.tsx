"use client";

import { ClientsPerAccount } from "@/app/lib/metrics/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { PieChart, Pie } from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export default function ClientsPieChart({
  data,
}: {
  data?: ClientsPerAccount[];
}) {
  const chartData = useMemo(() => {
    return data?.map((account, i) => ({
      ...account,
      fill: COLORS[i % COLORS.length],
    }));
  }, [data]);

  const chartConfig: ChartConfig = useMemo(() => {
    return data
      ? data.reduce((config, item, i) => {
          config[item.accountName] = {
            label: item.accountName,
            color: COLORS[i % COLORS.length],
          };
          return config;
        }, {} as ChartConfig)
      : {};
  }, [data]);

  return (
    <Card className="flex flex-col w-100">
      <CardHeader className="items-center pb-0">
        <CardTitle>Clientes por cuenta</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalClients"
              nameKey="accountName"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
