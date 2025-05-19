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
import useExcel from "../hooks/useExcel";
import { Button } from "@/components/ui/button";
import { es } from "date-fns/locale";
import _ from "lodash";

export default function Dashboard() {
  const { exportToExcel } = useExcel();

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

  const handleExportMetrics = () => {
    if (!metrics || !date) return;
    const {
      totalClients,
      totalDeposits,
      totalCommissions,
      unassignedDeposits,
      clientsPerAccount,
      depositsPerClient,
      commissionsPerClient,
    } = metrics;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToExport: { name: string; data: any[] }[] = [
      {
        name: "Resumen",
        data: [
          {
            "Total de clientes": totalClients,
            "Total de depósitos": totalDeposits,
            "Total de comisiones": totalCommissions,
            "Depósitos sin asignar": unassignedDeposits,
          },
        ],
      },
    ];
    if (clientsPerAccount.length > 0) {
      dataToExport.push({
        name: "Clientes por cuenta",
        data: clientsPerAccount.map((c) => ({
          "Nombre de cuenta": c.accountName,
          "Total de clientes": c.totalClients,
        })),
      });
    }

    if (depositsPerClient.length > 0) {
      dataToExport.push({
        name: "Depósitos por cliente",
        data: depositsPerClient.map((d) => ({
          Cliente: d.clientFullName,
          "Total de depósitos": d.totalDeposits,
        })),
      });
    }

    if (commissionsPerClient.length > 0) {
      dataToExport.push({
        name: "Comisiones por cliente",
        data: commissionsPerClient.map((c) => ({
          Cliente: c.clientFullName,
          "Total de comisiones": c.totalCommissions,
        })),
      });
    }

    exportToExcel(
      dataToExport,
      `Métricas - ${_.capitalize(format(date, "MMMM", { locale: es }))}`
    );
  };

  useEffect(() => {
    doGetMetrics();
  }, [date, doGetMetrics]);

  useEffect(() => {
    document.title = "Totalitarias";
  }, []);

  return (
    <div className="flex flex-col gap-y-4 h-full">
      <div className="flex items-center justify-between">
        <SingleDatePicker
          monthOnly
          date={date}
          withDeleteButton={false}
          setDate={setDate}
        />
        <Button
          className="self-start"
          disabled={!metrics}
          onClick={handleExportMetrics}
        >
          Exportar
        </Button>
      </div>

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
