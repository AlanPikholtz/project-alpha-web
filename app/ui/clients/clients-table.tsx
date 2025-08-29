"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import {
  FetchPageFn,
  useMinimalInfinite,
} from "@/app/hooks/use-minimal-infinite";
import { useLazyGetClientsQuery } from "@/app/lib/clients/api";
import { Client } from "@/app/lib/clients/types";
import { formatNumber } from "@/app/lib/helpers";
import SimpleInfiniteTable from "../simple-infinite-table";
import ClientActions from "./client-actions";

const columns: ColumnDef<Client & { fullName: string }>[] = [
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
  // Create lazy query trigger
  const [fetchClients] = useLazyGetClientsQuery();

  // Create fetchPage function
  const fetchPage: FetchPageFn<Client> = useCallback(
    async (params) => {
      const result = await fetchClients({
        page: params.page,
        limit: params.limit,
        // ✅ No accountId - show all clients like original
      }).unwrap();

      return result;
    },
    [fetchClients]
  );

  // Use the new React Native-style infinite hook
  const {
    data: clients,
    loading,
    loadingMore,
    hasMore,
    total,
    error,
    loadMore,
    optimisticDelete,
  } = useMinimalInfinite<Client>(
    fetchPage,
    {}, // No filters for clients - show all
    { pageSize: 100 } // Optimized for medium complexity
  );

  // Map clients to include fullName for display
  const mappedClients = useMemo(() => {
    return clients.map((client) => ({
      ...client,
      fullName: `${client.firstName} ${client.lastName}`,
    }));
  }, [clients]);

  // Create columns with optimistic functions
  const columnsWithActions: ColumnDef<Client & { fullName: string }>[] =
    useMemo(() => {
      return columns.map((col) => {
        if (col.id === "actions") {
          return {
            ...col,
            cell: ({ row }) => {
              const client = row.original;
              return (
                <ClientActions
                  client={client}
                  onOptimisticDelete={optimisticDelete}
                />
              );
            },
          };
        }
        return col;
      });
    }, [optimisticDelete]);

  return (
    <div className="h-full flex flex-col gap-y-6">
      {/* Table */}
      <div className="flex-1 min-h-0">
        <SimpleInfiniteTable
          columns={columnsWithActions}
          data={mappedClients}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          total={total}
          bottomLeftComponent={
            <div className="flex items-center gap-4">
              {error && (
                <div className="text-red-500 text-sm">Error cargando datos</div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
