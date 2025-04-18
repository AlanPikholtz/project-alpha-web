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
import { Checkbox } from "../../../components/ui/checkbox";

import { DateRange } from "react-day-picker";
import DateRangeFilter from "./filters/date-range-filter";
import StatusFilter from "./filters/status-filter";
import CustomTable from "../custom-table";
import { Transaction } from "@/app/lib/transactions/types";

const columns: ColumnDef<Partial<Transaction>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      const type = row.getValue("type");
      switch (type) {
        case "deposit":
          return "Depósito";
        default:
          return type;
      }
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
  {
    accessorKey: "clientId",
    header: "Cliente",
    cell: ({ row }) => {
      const clientId = row.getValue("clientId");
      return clientId || "Sin Asignar";
    },
  },
];

export default function NewTransactionsTable({
  data,
}: {
  data: Partial<Transaction>[];
}) {
  // Filters
  const [amountFilter, setAmountFilter] = useState<string>("");
  const [assignedFilter, setAssignedFilter] = useState<string>(""); // puede ser clientId o boolean según tu API
  const [dateRange, setDateRange] = useState<DateRange>();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        <Input
          className="max-w-sm"
          placeholder="Buscar monto"
          value={amountFilter}
          onChange={(e) => setAmountFilter(e.target.value)}
        />
        <StatusFilter
          assignedFilter={assignedFilter}
          setAssignedFilter={setAssignedFilter}
        />
      </div>
      {/* Table */}
      <CustomTable columns={columns} table={table} withSelectedRows />
    </div>
  );
}
