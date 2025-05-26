"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import CustomTable from "../custom-table";
import { useGetAccountsQuery } from "@/app/lib/accounts/api";
import { Account } from "@/app/lib/accounts/types";
import { useRouter } from "next/navigation";

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
];

export default function AccountsTable() {
  const router = useRouter();
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: accounts,
    isLoading: loadingAccounts,
    isFetching: fetchingAccounts,
  } = useGetAccountsQuery({
    page: pageIndex + 1, // Current page
    limit: pageSize, // Amount of pages
  });

  const table = useReactTable({
    data: accounts?.data || [],
    columns,
    pageCount: accounts?.pages,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
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
    <CustomTable
      columns={columns}
      table={table}
      withPagination
      loading={loadingAccounts}
      fetching={fetchingAccounts}
      onRowClick={({ id }) =>
        router.push(`/configuracion/cuentas/${id}/editar`)
      }
    />
  );
}
