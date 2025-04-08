"use client";

import { useGetClientsQuery } from "@/app/lib/clients/api";
import { Client } from "@/app/lib/clients/types";
import { useCreateTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React, { useMemo, useState } from "react";
import LoadingSpinner from "../loading-spinner";
import { XMarkIcon } from "@heroicons/react/16/solid";

function TransactionTableRow({
  transaction,
  clients,
  onDelete,
  onTransactionSaved,
}: {
  transaction: Partial<Transaction>;
  clients: Client[];
  onDelete: () => void;
  onTransactionSaved: () => void;
}) {
  const { type, amount, clientId, createdAt } = transaction;

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();

  const client = useMemo(() => {
    return (
      clients.find((x) => x.id === clientId)?.name || "Cliente no encontrado"
    );
  }, [clientId, clients]);

  const handleAssignUser = async (userId: number) => {
    if (!amount || !createdAt) return;
    try {
      await createTransaction({
        createdAt,
        amount,
        type: type === "Depósito" ? "deposit" : "payment",
        clientId: userId,
      }).unwrap();

      onTransactionSaved();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <tr>
      <td>
        <button className="cursor-pointer" onClick={onDelete}>
          <XMarkIcon className="w-5 h-10 text-red-500" />
        </button>
      </td>
      <td className="flex-1">{createdAt}</td>
      <td className="flex-1">{type}</td>
      <td className="flex-1">{amount}</td>
      <td className="flex-1">
        <div className="flex items-center justify-center">
          {isLoading ? <LoadingSpinner /> : null}
          {!isLoading && clientId ? client : null}
          {!isLoading && !clientId ? (
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="px-4 py-2 bg-blue-500 text-white rounded">
                Asignar cliente
              </MenuButton>
              <MenuItems
                as="div"
                className="absolute mt-2 w-48 p-2 bg-white border rounded shadow-lg z-10"
              >
                {clients.map((x) => (
                  <MenuItem key={x.id} as="div">
                    <button
                      className="px-4 py-2 w-full text-left hover:bg-gray-200"
                      onClick={() => handleAssignUser(x.id)}
                    >
                      {x.name}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

export default function AssignTransactionsTable() {
  const { data: clients } = useGetClientsQuery();

  const [tableData, setTableData] = useState<Partial<Transaction>[]>([]);
  const [amountFilter, setAmountFilter] = useState("");

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); // Prevent default pasting behavior
    const text: string = e.clipboardData.getData("text");

    const rows = text
      .split("\n")
      .map((row) => row.split("\t").map((cell) => cell.trim()));

    const parsedTransactions: Partial<Transaction>[] = rows.map((row) => ({
      createdAt: row[0], // Keep as string
      type: row[1], // Chusmear esto
      amount: parseFloat(row[2]), // Ensure correct number format
    }));

    setTableData(parsedTransactions);
  };

  const handleDelete = (index: number) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  return (
    <div className="flex rounded gap-x-4 h-full">
      <textarea
        className="h-full border flex-1"
        placeholder="Pegue las transacciones (maximo 100)"
        onPaste={handlePaste}
      />
      <div className="flex flex-1 flex-col gap-y-4 border p-4 rounded">
        <div>
          <p>Filtros</p>
          <input
            placeholder="Monto"
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
          />
        </div>
        <table className="flex overflow-y-auto border-separate border-spacing-y-2 border-spacing-x-4">
          <tbody>
            <tr>
              <td />
              <td className="flex-1">Fecha</td>
              <td className="flex-1">Tipo</td>
              <td className="flex-1">Monto</td>
              <td className="flex-1 flex justify-center">Cliente</td>
            </tr>
            {tableData
              .filter((x) => x.amount?.toString().includes(amountFilter))
              .map((row, i) => (
                <TransactionTableRow
                  key={i}
                  transaction={row}
                  clients={clients || []}
                  onDelete={() => handleDelete(i)}
                  onTransactionSaved={() => handleDelete(i)}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
