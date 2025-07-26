"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import SimpleInfiniteTable from "../simple-infinite-table";
import { useMinimalInfinite } from "@/app/hooks/use-minimal-infinite";
import { useGetAccountsQuery } from "@/app/lib/accounts/api";
import { Account } from "@/app/lib/accounts/types";
import AccountActions from "./account-actions";

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const account = row.original;
      return <AccountActions account={account} />;
    },
    meta: { className: "w-24 text-center" },
    enableSorting: false,
  },
];

export default function AccountsTable() {
  // Use the new MINIMAL infinite scroll
  const {
    data: accounts,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    total,
  } = useMinimalInfinite<Account, Parameters<typeof useGetAccountsQuery>[0]>(
    useGetAccountsQuery,
    {}, // No base args needed for accounts
    { pageSize: 20 }
  );

  return (
    <SimpleInfiniteTable
      columns={columns}
      data={accounts}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      total={total}
    />
  );
}
