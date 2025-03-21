"use client";

import React, { useMemo } from "react";
import { Transaction } from "../lib/transactions/types";
import { Client } from "../lib/clients/types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useCreateTransactionMutation } from "../lib/transactions/api";

export default function TransactionCard({
  transaction,
  clients,
}: {
  transaction: Partial<Transaction>;
  clients: Client[];
}) {
  const { createdAt, amount, type, clientId } = transaction;

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
        clientId: userId,
        amount,
        createdAt,
      }).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="border flex flex-col items-start gap-y-4 rounded border-black/20 shadow p-4">
      <div>
        <p>Fecha: {createdAt}</p>
        <p>Monto: ${amount}</p>
        <p>Tipo: {type}</p>
      </div>

      {isLoading ? <div>Loading...</div> : null}
      {!clientId ? (
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="px-4 py-2 bg-blue-500 text-white rounded">
            Asignar cliente
          </MenuButton>
          <MenuItems
            as="div"
            className="absolute mt-2 w-48 p-2 bg-white border rounded shadow-lg"
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
      ) : (
        <p>Cliente: {client}</p>
      )}
    </div>
  );
}
