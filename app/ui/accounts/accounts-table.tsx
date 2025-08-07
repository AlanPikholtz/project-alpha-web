"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";

import SimpleInfiniteTable from "../simple-infinite-table";
import {
  useMinimalInfinite,
  FetchPageFn,
} from "@/app/hooks/use-minimal-infinite";
import { useLazyGetAccountsQuery } from "@/app/lib/accounts/api";
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

interface AccountsTableProps {
  onOptimisticFunctionsReady?: (functions: {
    optimisticAdd: (item: Account) => void;
    refresh: () => Promise<void>;
  }) => void;
}

export default function AccountsTable({
  onOptimisticFunctionsReady,
}: AccountsTableProps) {
  // Create lazy query trigger
  const [fetchAccounts] = useLazyGetAccountsQuery();

  // Create fetchPage function
  const fetchPage: FetchPageFn<Account> = useCallback(
    async (params) => {
      const result = await fetchAccounts({
        page: params.page,
        limit: params.limit,
      }).unwrap();

      return result;
    },
    [fetchAccounts]
  );

  // Use the new React Native-style infinite hook
  const {
    data: accounts,
    loading,
    loadingMore,
    hasMore,
    total,
    error,
    loadMore,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
    refresh,
  } = useMinimalInfinite<Account>(
    fetchPage,
    {}, // No filters for accounts - show all
    { pageSize: 100 } // Optimized for simple structure & few total items
  );

  // Expose optimistic functions to parent component
  useEffect(() => {
    if (onOptimisticFunctionsReady) {
      onOptimisticFunctionsReady({
        optimisticAdd,
        refresh,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOptimisticFunctionsReady]); // Only depend on the callback

  // Create columns with optimistic functions
  const columnsWithActions: ColumnDef<Account>[] = useMemo(() => {
    return columns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }) => {
            const account = row.original;
            return (
              <AccountActions
                account={account}
                onOptimisticUpdate={optimisticUpdate}
                onOptimisticDelete={optimisticDelete}
                onError={refresh}
              />
            );
          },
        };
      }
      return col;
    });
  }, [optimisticUpdate, optimisticDelete, refresh]);

  return (
    <SimpleInfiniteTable
      columns={columnsWithActions}
      data={accounts}
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
  );
}
