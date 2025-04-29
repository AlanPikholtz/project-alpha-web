"use client";

import React, { useEffect } from "react";
import { useGetMetricsQuery } from "../lib/metrics/api";
import ClientsPieChart from "../ui/metrics/clients-pie-chart";

export default function Dashboard() {
  const { data: metrics } = useGetMetricsQuery();

  useEffect(() => {
    document.title = "Totalitarias";
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ClientsPieChart data={metrics?.clientsPerAccount} />
    </div>
  );
}
