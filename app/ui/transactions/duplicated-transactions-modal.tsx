import { Transaction } from "@/app/lib/transactions/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import React, { useMemo } from "react";
import CustomTable from "../custom-table";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";
import { formatNumber } from "@/app/lib/helpers";

const columns: ColumnDef<Partial<Transaction>>[] = [
  {
    accessorKey: "date",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("date")).toLocaleString("es-AR");
      return formatted;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return _.capitalize(transactionTypeToString(row.getValue("type")));
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return formatNumber(amount, { style: "currency", currency: "ARS" });
    },
    filterFn: (row, columnId, filterValue) => {
      const amount = row.getValue(columnId);
      return amount !== undefined && amount !== null
        ? amount.toString().includes(filterValue.toString())
        : false;
    },
  },
];

export default function DuplicatedTransactionsModal({
  open,
  transactions,
  onClose,
}: {
  open: boolean;
  transactions: Partial<Transaction>[];
  onClose: (open: boolean) => void;
}) {
  const description = useMemo(() => {
    return transactions.length === 1
      ? "Se encontró 1 depósito duplicado. Este será eliminado de la tabla y no se guardado al finalizar"
      : `Se encontraron ${transactions.length} depósitos duplicados. Estos seran eliminados de la tabla y no seran guardados al finalizar`;
  }, [transactions]);

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transacciones duplicadas!</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {/* Table */}
        <CustomTable
          tableBodyClassName="max-h-100"
          columns={columns}
          table={table}
        />
        <AlertDialogFooter>
          <AlertDialogAction>Cerrar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
