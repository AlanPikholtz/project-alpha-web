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

// Modal for assigning a client to >= 1 transactions
export default function AssignClientModal({
  transactionsAmount,
}: {
  transactionsAmount: number;
}) {
  const { data: clients } = useGetClientsQuery({});
  const [bulkUpdateTransactions, {}] = useBulkUpdateTransactionMutation()
  
  const [selectedClientId, setSelectedClientId] = useState<number>();


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Asignar depósitos</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-100">
        <DialogHeader>
          <DialogTitle>Asignar depósitos</DialogTitle>
          <DialogDescription>
            {transactionsAmount > 1
              ? `Elija el cliente al cual se le asignaran los ${transactionsAmount} depósitos.`
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
                  onSelect={() => {
                    setSelectedClientId(client.id);
                  }}
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
      </DialogContent>
    </Dialog>
  );
}
