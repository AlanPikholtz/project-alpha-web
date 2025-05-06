"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useLazyGetMetricsQuery } from "../lib/metrics/api";
import ClientsPieChart from "../ui/metrics/clients-pie-chart";
import MetricCard from "../ui/metrics/metric-card";
import SingleDatePicker from "../ui/transactions/filters/single-date-picker";

export default function Dashboard() {
  const [getMetrics, { data: metrics }] = useLazyGetMetricsQuery();

  const [date, setDate] = useState<Date | undefined>(new Date());

  const doGetMetrics = useCallback(async () => {
    if (!date) return;
    try {
      await getMetrics({ date: date.toISOString() }).unwrap();
    } catch (e) {
      console.log(e);
    }
  }, [date, getMetrics]);

  useEffect(() => {
    doGetMetrics();
  }, [date, doGetMetrics]);

  useEffect(() => {
    document.title = "Totalitarias";
  }, []);

  return (
    <div className="flex flex-col gap-y-4 h-full">
      <SingleDatePicker date={date} setDate={setDate} />
      <div className="flex items-center gap-x-2">
        <MetricCard title="Clientes totales" value={metrics?.totalClients} />
        <MetricCard title="Depositos totales" value={metrics?.totalDeposits} />
        <MetricCard
          title="Comisiones totales"
          value={metrics?.totalCommissions}
        />
        <MetricCard
          title="Depositos no asignados"
          value={metrics?.unassignedDeposits}
        />
      </div>
      <ClientsPieChart data={metrics?.clientsPerAccount} />
    </div>
  );
}
