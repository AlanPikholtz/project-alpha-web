"use client";

import { useAccountId } from "@/app/context/account-provider";
import { useGetClientsQuery } from "@/app/lib/clients/api";
import { Client } from "@/app/lib/clients/types";
import { useUpdateTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import React from "react";

export default function AssignClientDropdown({
  transaction,
}: {
  transaction: Partial<Transaction>;
}) {
  const { selectedAccountId } = useAccountId();
  const { data: clients, isLoading: loading } = useGetClientsQuery(
    {
      accountId: selectedAccountId,
      limit: 0,
    },
    { skip: !selectedAccountId }
  );

  const [updateTransaction, { isLoading: assigningTransaction }] =
    useUpdateTransactionMutation();
  const [open, setOpen] = React.useState(false);

  const doAssignAndSaveTransaction = async (client: Client) => {
    if (!selectedAccountId || !transaction.id) return;
    try {
      // Lets update the transaction with a user id
      await updateTransaction({
        ...transaction,
        transactionId: transaction.id,
        clientId: client.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (assigningTransaction) {
    return (
      <div className="h-10 flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (transaction.clientId) {
    return (
      <div className="h-10 flex items-center">{transaction.clientFullName}</div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="min-w-[180px] h-10 justify-between"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          asChild
          disabled={loading}
        >
          Asignar cliente
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." className="h-9" />
          <CommandList>
            <CommandEmpty>Cliente no encontrado.</CommandEmpty>
            <CommandGroup>
              {clients?.data.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.code}`}
                  onSelect={(currentValue) => {
                    console.log({ currentValue });
                    doAssignAndSaveTransaction(client);
                    setOpen(false);
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
      </PopoverContent>
    </Popover>
  );
}
