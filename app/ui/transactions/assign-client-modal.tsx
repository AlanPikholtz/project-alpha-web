"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetClientsQuery } from "@/app/lib/clients/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useBulkUpdateTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { useAccountId } from "@/app/context/account-provider";
import ApiErrorMessage from "../api-error-message";

// Modal for assigning a client to >= 1 transactions
export default function AssignClientModal({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { selectedAccountId } = useAccountId();

  const [open, setOpen] = useState<boolean>(false);

  const { data: clients } = useGetClientsQuery(
    { accountId: selectedAccountId },
    { skip: !selectedAccountId }
  );
  const [bulkUpdateTransactions, { error: errorUpdating }] =
    useBulkUpdateTransactionMutation();

  const doBulkUpdate = async (clientId: number) => {
    try {
      await bulkUpdateTransactions({
        clientId,
        transactionIds: transactions.map((x) => x.id),
      }).unwrap();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Asignar depósitos</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-100">
        <DialogHeader>
          <DialogTitle>Asignar depósitos</DialogTitle>
          <DialogDescription>
            {transactions.length > 1
              ? `Elija el cliente al cual se le asignaran los ${transactions.length} depósitos.`
              : "Elija el cliente al cual se le asignara el depósito."}
          </DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput placeholder="Buscar cliente..." className="h-10" />
          <CommandList>
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandGroup heading="Resultados">
              {clients?.data.map((client) => (
                <CommandItem
                  key={client.id}
                  className="cursor-pointer"
                  value={`${client.code}`}
                  onSelect={() => doBulkUpdate(client.id)}
                >
                  <div className="flex flex-col gap-y-1">
                    {client.code}
                    <p className="text-slate-500 text-xs">
                      {client.firstName} {client.lastName}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        {errorUpdating && <ApiErrorMessage error={errorUpdating} />}
      </DialogContent>
    </Dialog>
  );
}
