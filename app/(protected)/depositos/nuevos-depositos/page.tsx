"use client";

import { Transaction } from "@/lib/transactions/types";
import TransactionsTable from "@/components/transactions/transactions-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export default function NewTransactionsPage() {
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Fecha/Hora",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("es-AR", {
          // Argetina formatting
          style: "currency",
          currency: "ARS",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "client",
      header: "Cliente",
    },
  ];

  return (
    <div>
      <TransactionsTable columns={columns} data={[]} />
    </div>
  );
}
