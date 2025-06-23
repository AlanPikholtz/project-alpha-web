"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import React, { useMemo, useState } from "react";

import CustomTable from "../custom-table";
import { Client } from "@/app/lib/clients/types";
import { useGetClientsQuery } from "@/app/lib/clients/api";
import ClientActions from "./client-actions";

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "fullName",
    header: "Cliente",
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

// A table used to display all clients on a table with actions like update/delete?
export default function ClientsTable() {
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: clients,
    isLoading: loading,
    isFetching: fetchingClients,
  } = useGetClientsQuery({
    // accountId: selectedAccountId,
    page: pageIndex + 1, // Current page
    limit: pageSize, // Amount of pages
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Lets map clients for now to get the full name, this could be asked to BE
  const mappedClients = useMemo(() => {
    return clients?.data.map((x) => {
      return { ...x, fullName: `${x.firstName} ${x.lastName}` };
    });
  }, [clients?.data]);

  const table = useReactTable({
    data: mappedClients || [],
    columns,
    pageCount: clients?.pages,
    state: {
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Table */}
      <CustomTable
        columns={columns}
        table={table}
        loading={loading}
        fetching={fetchingClients}
        withPagination
        // onRowClick={(row) => router.push(`/clientes/${row.id}`)}
      />
    </div>
  );
}
