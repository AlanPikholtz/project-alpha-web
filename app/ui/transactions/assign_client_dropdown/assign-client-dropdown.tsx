"use client";

import { useAccountId } from "@/app/context/account-provider";
import { useGetClientsQuery } from "@/app/lib/clients/api";
import { useBulkUpdateTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { Button } from "@/components/ui/button";
import {
  Command,
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
import UnassignTransactionsModal from "./unassign-transactions-modal";
import DeleteSingleTransactionModal from "./delete-single-transaction-modal";

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

  const [bulkUpdateTransactions, { isLoading: updatingLoading }] =
    useBulkUpdateTransactionMutation();

  const [open, setOpen] = React.useState(false);

  const handleBulkUpdate = async (clientId: number) => {
    if (!transaction.id) return;
    try {
      await bulkUpdateTransactions({
        clientId,
        transactionIds: [transaction.id],
      }).unwrap();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (updatingLoading) {
    return (
      <div className="h-10 flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
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
          {transaction.clientFullName || "Asignar cliente"}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." className="h-9" />
          <CommandList>
            <CommandGroup heading="Clientes disponibles">
              {clients?.data.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.code}`}
                  onSelect={() => handleBulkUpdate(client.id)}
                >
                  <div className="flex flex-col gap-y-0.5">
                    <span>{client.code}</span>
                    <p className="text-muted-foreground text-xs">
                      {client.firstName} {client.lastName}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {!transaction.clientId && (
              <DeleteSingleTransactionModal
                transaction={transaction}
                setOpen={setOpen}
              />
            )}
            {transaction.clientId && (
              <UnassignTransactionsModal
                transaction={transaction}
                setOpen={setOpen}
              />
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
