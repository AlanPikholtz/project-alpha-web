"use client";

import { Transaction } from "@/app/lib/transactions/types";
import TransactionsTable from "@/app/ui/transactions/transactions-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";

export default function TransactionsPage() {
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
      <h1>Transacciones</h1>
      <div className="flex items-center justify-between">
        {/* Dropdown */}
        <div></div>
        {/* New transaccions */}
        <Button asChild>
          <Link href="/transactions/new">Nuevas Transacciones</Link>
        </Button>
      </div>
      <TransactionsTable columns={columns} data={[]} />
    </div>
  );
}
