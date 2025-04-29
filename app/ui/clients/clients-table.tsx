"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Input } from "../../../components/ui/input";

import CustomTable from "../custom-table";
import { Client } from "@/app/lib/clients/types";
import { useGetClientsQuery } from "@/app/lib/clients/api";

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "fullName",
    header: "Cliente",
  },
];

// A table used to display all clients on a table with actions like update/delete?
export default function ClientsTable() {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState<string>("");

  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: clients,
    isLoading: loading,
    isFetching: fetchingClients,
  } = useGetClientsQuery({
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

  const onRowClick = (client: Client) => {
    router.push(`/clientes/${client.id}`);
  };

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4">
        <Input
          className="max-w-sm"
          placeholder="Buscar monto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Table */}
      <CustomTable
        columns={columns}
        table={table}
        loading={loading}
        fetching={fetchingClients}
        withPagination
        onRowClick={onRowClick}
      />
    </div>
  );
}
