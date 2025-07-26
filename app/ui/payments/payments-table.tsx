"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import SimpleInfiniteTable from "../simple-infinite-table";
import { useMinimalInfinite } from "@/app/hooks/use-minimal-infinite";
import { useGetPaymentsQuery } from "@/app/lib/payments/api";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import { Payment } from "@/app/lib/payments/types";
import DeletePaymentDialog from "./delete-payment-dialog";
import _ from "lodash";

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
  {
    accessorKey: "clientCode",
    header: "Código de Cliente",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const payment = row.original;
      return <DeletePaymentDialog payment={payment} />;
    },
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

  // Use the new MINIMAL infinite scroll
  const {
    data: payments,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    total,
  } = useMinimalInfinite<Payment, Parameters<typeof useGetPaymentsQuery>[0]>(
    useGetPaymentsQuery,
    {
      ...(debouncedAmountFilter !== "" && { amount: +debouncedAmountFilter }),
    },
    { pageSize: 20 }
  );

  return (
    <SimpleInfiniteTable
      columns={columns}
      data={payments}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      total={total}
    />
  );
}
