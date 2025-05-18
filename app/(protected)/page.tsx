"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useLazyGetMetricsQuery } from "../lib/metrics/api";
import MetricCard from "../ui/metrics/metric-card";
import SingleDatePicker from "../ui/transactions/filters/single-date-picker";
import { format } from "date-fns";
import { formatNumber } from "../lib/helpers";
import DepositsPerClient from "../ui/metrics/deposits-per-client";
import CommissionsPerClient from "../ui/metrics/commissions-per-client";
import ClientsPerAcconut from "../ui/metrics/clients-per-account";
import { BanknoteIcon, UserIcon, UserXIcon } from "lucide-react";
import MetricsSkeleton from "../ui/metrics/skeleton/MetricsSkeleton";

export default function Dashboard() {
  const [
    getMetrics,
    { data: metrics, isLoading: loadingMetrics, isFetching: fetchingMetrics },
  ] = useLazyGetMetricsQuery();

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

      {(loadingMetrics || fetchingMetrics) && <MetricsSkeleton />}
      {!loadingMetrics && !fetchingMetrics && (
        <div className="flex-1 flex flex-col gap-y-10 justify-center">
          <div className="flex items-center gap-x-4">
            <MetricCard
              title="Clientes totales"
              value={formatNumber(+(metrics?.totalClients || 0))}
              icon={<UserIcon />}
            />
            <MetricCard
              title="Depositos totales"
              value={formatNumber(+(metrics?.totalDeposits || 0), {
                style: "currency",
                currency: "ARS",
              })}
              icon={<BanknoteIcon />}
            />
            <MetricCard
              title="Comisiones totales"
              value={formatNumber(+(metrics?.totalCommissions || 0), {
                style: "currency",
                currency: "ARS",
              })}
              icon={<BanknoteIcon />}
            />
            <MetricCard
              title="Depositos no asignados"
              value={formatNumber(+(metrics?.unassignedDeposits || 0))}
              icon={<UserXIcon />}
            />
          </div>

          <div className="flex  items-center gap-x-4 h-full">
            <ClientsPerAcconut data={metrics?.clientsPerAccount} />
            <DepositsPerClient data={metrics?.depositsPerClient} />
            <CommissionsPerClient data={metrics?.commissionsPerClient} />
          </div>
        </div>
      )}
    </div>
  );
}
