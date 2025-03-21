"use client";

import { useGetClientsQuery } from "@/app/lib/clients/api";
import { Client } from "@/app/lib/clients/types";
import { useCreateTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React, { useMemo, useState } from "react";
import LoadingSpinner from "../loading-spinner";

function TransactionTableRow({
  transaction,
  index, // This will be used for removing it from the table after saving that transaction
  clients,
  onTransactionSaved,
}: {
  transaction: Partial<Transaction>;
  index: number;
  clients: Client[];
  onTransactionSaved: (index: number) => void;
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

      onTransactionSaved(index);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <tr>
      <td className="w-1/4">{createdAt}</td>
      <td className="w-1/4">{type}</td>
      <td className="w-1/4">{amount}</td>
      <td className="w-1/4">
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

    console.log({ rows });

    const parsedTransactions: Partial<Transaction>[] = rows.map((row) => ({
      createdAt: row[0], // Keep as string
      type: row[1], // Chusmear esto
      amount: parseFloat(row[2]), // Ensure correct number format
    }));

    setTableData(parsedTransactions);
  };

  const handleTransactionSaved = (index: number) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  return (
    <div className="flex flex-col border rounded h-full border-black/10">
      {tableData.length === 0 ? (
        <textarea
          className="h-full"
          placeholder="Pegue las transacciones (maximo 100)"
          onPaste={handlePaste}
        />
      ) : (
        <div className="flex flex-col gap-y-4">
          <div>
            <p>Filtros</p>
            <input
              placeholder="Monto"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
            />
          </div>
          <table className="w-full border-separate border-spacing-y-2 border-spacing-x-4">
            <tbody>
              <tr>
                <td className="w-1/4">Fecha</td>
                <td className="w-1/4">Tipo</td>
                <td className="w-1/4">Monto</td>
                <td className="w-1/4 text-center">Cliente</td>
              </tr>
              {tableData
                .filter((x) => x.amount?.toString().includes(amountFilter))
                .map((row, i) => (
                  <TransactionTableRow
                    key={i}
                    index={i}
                    transaction={row}
                    clients={clients || []}
                    onTransactionSaved={handleTransactionSaved}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
