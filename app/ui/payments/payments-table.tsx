import { Payment } from "@/app/lib/payments/types";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import CustomTable from "../custom-table";
import { useGetPaymentsQuery } from "@/app/lib/payments/api";
import _ from "lodash";
import { paymentMethodToString } from "@/app/lib/payments/helpers";
import { formatDate, formatNumber } from "@/app/lib/helpers";
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: payments,
    isLoading: loadingPayments,
    isFetching: fetchingPayments,
  } = useGetPaymentsQuery(
    {
      ...(debouncedAmountFilter !== "" && { amount: +debouncedAmountFilter }),
      page: pageIndex + 1, // Current page
      limit: pageSize, // Amount of pages
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const table = useReactTable({
    data: payments?.data || [],
    columns,
    pageCount: payments?.pages,
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

  // Amount Search
  useEffect(() => {
    const handler = _.debounce((value: string) => {
      setDebouncedAmountFilter(value);
    }, 400); // 400ms debounce

    handler(amountFilter);

    // Cancelar debounce si el componente se desmonta o cambia
    return () => {
      handler.cancel();
    };
  }, [amountFilter]);

  // Reset page on filters change
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedAmountFilter]);

  return (
    <CustomTable
      columns={columns}
      table={table}
      loading={loadingPayments}
      fetching={fetchingPayments}
      withPagination
    />
  );
}
