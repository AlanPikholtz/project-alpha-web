import { Payment } from "@/app/lib/payments/types";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("date")).toLocaleString("es-AR");
      return formatted;
    },
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

      return formatted;
    },
  },
  { accessorKey: "currency", header: "Moneda" },
  { accessorKey: "method", header: "Metodo" },
  { accessorKey: "clientId", header: "ID Cliente" },
];

export default function PaymentsTable() {
  return <div>PaymentsTable</div>;
}
