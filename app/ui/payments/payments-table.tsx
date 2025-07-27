"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import SimpleInfiniteTable from "../simple-infinite-table";
import {
  useMinimalInfinite,
  FetchPageFn,
} from "@/app/hooks/use-minimal-infinite";
import { useLazyGetPaymentsQuery } from "@/app/lib/payments/api";
import { Payment } from "@/app/lib/payments/types";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import _ from "lodash";
import { paymentMethodToString } from "@/app/lib/payments/helpers";
import DeletePaymentDialog from "./delete-payment-dialog";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentRequestDate",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("paymentRequestDate"));
      return formatted;
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return formatNumber(amount, { style: "currency", currency: "ARS" });
    },
  },
  { accessorKey: "currency", header: "Moneda" },
  {
    accessorKey: "method",
    header: "Método",
    cell: ({ row }) => {
      return _.capitalize(paymentMethodToString(row.getValue("method")));
    },
  },
  { accessorKey: "clientCode", header: "Código de cliente" },
  {
    id: "actions",
    header: "Acciones",
    cell: () => null, // Will be overridden by columnsWithActions
    meta: { className: "w-24 text-center" },
    enableSorting: false,
  },
];

export default function PaymentsTable({
  amountFilter,
}: {
  amountFilter: string;
}) {
  // Filters
  const [debouncedAmountFilter, setDebouncedAmountFilter] =
    useState<string>("");

  // Amount Search debouncing
  useEffect(() => {
    const handler = _.debounce((value: string) => {
      setDebouncedAmountFilter(value);
    }, 400);

    handler(amountFilter);

    return () => {
      handler.cancel();
    };
  }, [amountFilter]);

  // Create lazy query trigger
  const [fetchPayments] = useLazyGetPaymentsQuery();

  // Create fetchPage function
  const fetchPage: FetchPageFn<Payment> = useCallback(
    async (params) => {
      const result = await fetchPayments({
        page: params.page,
        limit: params.limit,
        ...(params.amount ? { amount: params.amount as number } : {}),
      }).unwrap();

      return result;
    },
    [fetchPayments]
  );

  // Use the new React Native-style infinite hook
  const {
    data: payments,
    loading,
    loadingMore,
    hasMore,
    total,
    error,
    loadMore,
    optimisticDelete,
  } = useMinimalInfinite<Payment>(
    fetchPage,
    {
      ...(debouncedAmountFilter !== "" && { amount: +debouncedAmountFilter }),
    },
    { pageSize: 20 }
  );

  // Create columns with optimistic delete
  const columnsWithActions: ColumnDef<Payment>[] = useMemo(() => {
    return columns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }) => {
            const payment = row.original;
            return (
              <DeletePaymentDialog
                payment={payment}
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
    <SimpleInfiniteTable
      columns={columnsWithActions}
      data={payments}
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
