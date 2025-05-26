"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import CustomTable from "../custom-table";
import { Transaction } from "@/app/lib/transactions/types";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";
import AccountSelector from "../account-selector";
import { Button } from "@/components/ui/button";
import { useCreateBulkTransactionMutation } from "@/app/lib/transactions/api";
import { useAccountId } from "@/app/context/account-provider";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/app/lib/helpers";
import { toast } from "sonner";
import DuplicatedTransactionsModal from "./duplicated-transactions-modal";

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

export default function NewTransactionsTable({
  data,
}: {
  data: Partial<Transaction>[];
}) {
  const router = useRouter();

  const { selectedAccountId } = useAccountId();

  const [duplicatedTransactions, setDuplicatedTransactions] = useState<
    Partial<Transaction>[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [createBulkTransaction, { isLoading: loading }] =
    useCreateBulkTransactionMutation();

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  // Vulk saving
  const handleSave = async () => {
    if (!selectedAccountId) return;
    try {
      await createBulkTransaction({
        accountId: selectedAccountId,
        transactions: data,
      }).unwrap();

      // Redirect
      router.back();
      toast.success("Depositos guardados.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (
        e?.data?.error === "DuplicateEntryError" &&
        Array.isArray(e?.data?.messages)
      ) {
        setDuplicatedTransactions(e.data.messages);
        setShowModal(true);
      } else {
        console.error(e);
        toast.error("Error inesperado al guardar los depósitos.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-10 items-center">
          <AccountSelector disable />
          <Input
            className="max-w-sm"
            placeholder="Buscar monto"
            type="number"
            value={
              (table.getColumn("amount")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("amount")?.setFilterValue(event.target.value)
            }
          />
        </div>
        <Button loading={loading} onClick={handleSave}>
          Guardar
        </Button>
      </div>
      {/* Table */}
      <CustomTable columns={columns} table={table} />
      <DuplicatedTransactionsModal
        open={showModal}
        transactions={duplicatedTransactions}
        onClose={setShowModal}
      />
    </div>
  );
}
