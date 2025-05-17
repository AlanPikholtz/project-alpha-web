"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useLazyGetMetricsQuery } from "../lib/metrics/api";
import ClientsPieChart from "../ui/metrics/clients-pie-chart";
import MetricCard from "../ui/metrics/metric-card";
import SingleDatePicker from "../ui/transactions/filters/single-date-picker";
import { format } from "date-fns";
import { formatNumber } from "../lib/helpers";

export default function Dashboard() {
  const [getMetrics, { data: metrics }] = useLazyGetMetricsQuery();

  const [date, setDate] = useState<Date | undefined>(new Date());

  const doGetMetrics = useCallback(async () => {
    if (!date) return;
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      await getMetrics({ date: formattedDate }).unwrap();
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
      <SingleDatePicker
        monthOnly
        date={date}
        withDeleteButton={false}
        setDate={setDate}
      />
      <div className="flex items-center gap-x-2">
        <MetricCard
          title="Clientes totales"
          value={formatNumber(metrics?.totalClients || 0)}
        />
        <MetricCard
          title="Depositos totales"
          value={formatNumber(+(metrics?.totalDeposits || 0))}
        />
        <MetricCard
          title="Comisiones totales"
          value={formatNumber(+(metrics?.totalCommissions || 0), {
            style: "currency",
            currency: "ARS",
          })}
        />
        <MetricCard
          title="Depositos no asignados"
          value={formatNumber(+(metrics?.unassignedDeposits || 0))}
        />
      </div>
      <ClientsPieChart data={metrics?.clientsPerAccount} />
    </div>
  );
}
