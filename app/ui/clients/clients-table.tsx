"use client";

import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import SimpleInfiniteTable from "../simple-infinite-table";
import { useMinimalInfinite } from "@/app/hooks/use-minimal-infinite";
import { useGetClientsQuery } from "@/app/lib/clients/api";
import { Client } from "@/app/lib/clients/types";
import ClientActions from "./client-actions";
import { formatNumber } from "@/app/lib/helpers";
import { useAccountId } from "@/app/context/account-provider";

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "fullName",
    header: "Nombre Completo",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      return formatNumber(amount, { style: "currency", currency: "ARS" });
    },
  },
  {
    accessorKey: "commission",
    header: "Comisión",
    cell: ({ row }) => {
      const commission = parseFloat(row.getValue("commission"));
      return `${commission}%`;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const client = row.original;
      return <ClientActions client={client} />;
    },
    meta: { className: "w-24 text-center" },
    enableSorting: false,
  },
];

export default function ClientsTable() {
  const { selectedAccountId } = useAccountId();

  // Use the new ULTRA-MINIMAL infinite scroll
  const {
    data: clients,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    total,
  } = useMinimalInfinite<Client, Parameters<typeof useGetClientsQuery>[0]>(
    useGetClientsQuery,
    { accountId: selectedAccountId },
    { pageSize: 20 }
  );

  // Map clients to include fullName for display
  const mappedClients = useMemo(() => {
    return clients.map((client) => ({
      ...client,
      fullName: `${client.firstName} ${client.lastName}`,
    }));
  }, [clients]);

  // Show loading when account is not selected yet
  if (selectedAccountId === null) {
    return (
      <div className="h-full flex flex-col gap-y-6">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-muted-foreground">Cargando cuenta...</div>
        </div>
      </div>
    );
  }

  return (
    <SimpleInfiniteTable
      columns={columns}
      data={mappedClients}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      total={total}
      // onRowClick={(row) => router.push(`/clientes/${row.id}`)}
    />
  );
}
