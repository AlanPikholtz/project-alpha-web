"use client";

import React, { useCallback, useMemo } from "react";
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
import AssignClientDropdown from "./assign-client-dropdown";
import { Client } from "@/app/lib/clients/types";

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
      const formatted = new Intl.NumberFormat("es-AR", {
        // Argetina formatting
        style: "currency",
        currency: "ARS",
      }).format(amount);

      return formatted;
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
  setData,
}: {
  data: Partial<Transaction>[];
  setData: (data: Partial<Transaction>[]) => void;
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const handleTableUpdate = useCallback(
    (client: Client, rowIndex: number) => {
      // Lets find the row that was just updated and add a client to it
      const updatedData = [...data];
      data[rowIndex].clientId = client.id;
      data[rowIndex].clientFullName = `${client.firstName} ${client.lastName}`;
      // Updates table state
      setData(updatedData);
    },
    [data, setData]
  );

  const mutableColumns = useMemo(() => {
    return [
      ...columns,
      {
        accessorKey: "clientId",
        header: "Cliente",
        cell: ({ row }) => (
          <AssignClientDropdown
            transaction={row.original}
            updateTable={(client) => handleTableUpdate(client, row.index)}
          />
        ),
      },
    ];
  }, [handleTableUpdate]);

  const table = useReactTable({
    data,
    columns: mutableColumns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4">
        <Input
          className="max-w-sm"
          placeholder="Buscar monto"
          type="number"
          value={(table.getColumn("amount")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("amount")?.setFilterValue(event.target.value)
          }
        />
      </div>
      {/* Table */}
      <CustomTable columns={columns} table={table} />
    </div>
  );
}
