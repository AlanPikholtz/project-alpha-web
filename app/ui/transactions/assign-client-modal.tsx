"use client";

import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

// Modal for assigning a client to >= 1 transactions
export default function AssignClientModal({
  transactions,
  onSuccessAssign,
  onOptimisticUpdate,
}: {
  transactions: Transaction[];
  onSuccessAssign: () => void;
  onOptimisticUpdate?: (
    id: number | string,
    updater: (item: Transaction) => Transaction
  ) => void;
}) {
  const { selectedAccountId } = useAccountId();

  const [open, setOpen] = useState<boolean>(false);

  const { data: clients } = useGetClientsQuery(
    { accountId: selectedAccountId },
    { skip: !selectedAccountId }
  );
  const [bulkUpdateTransactions, { reset, error: errorUpdating, isLoading }] =
    useBulkUpdateTransactionMutation();

  const doBulkUpdate = async (clientId: number) => {
    try {
      // Find the selected client
      const selectedClient = clients?.data.find((c) => c.id === clientId);
      if (!selectedClient) return;

      // If we have optimistic functions, use them
      if (onOptimisticUpdate) {
        console.log(
          "⚡ Optimistically assigning client",
          selectedClient.firstName,
          selectedClient.lastName,
          "to",
          transactions.length,
          "transactions"
        );

        // 1. Optimistic: update all selected transactions immediately
        transactions.forEach((transaction) => {
          onOptimisticUpdate(transaction.id, (currentTransaction) => ({
            ...currentTransaction,
            clientId: clientId,
            clientFullName: `${selectedClient.firstName} ${selectedClient.lastName}`,
          }));
        });

        // 2. Make the API call and wait for response
        await bulkUpdateTransactions({
          clientId,
          transactionIds: transactions.map((x) => x.id),
        }).unwrap();

        console.log("✅ Bulk assignment confirmed by backend");

        // 3. Only close modal and deselect if API call was successful
        onSuccessAssign();
        setOpen(false);
      } else {
        // Fallback to original behavior if no optimistic functions
        await bulkUpdateTransactions({
          clientId,
          transactionIds: transactions.map((x) => x.id),
        }).unwrap();

        // De-Select items
        onSuccessAssign();
        // Close modal
        setOpen(false);
      }
    } catch (error) {
      console.error(
        "❌ Error in bulk assignment, keeping modal open to show error",
        error
      );

      // Don't close modal - let user see the error and try again
      // The modal will automatically show the error via {errorUpdating && <ApiErrorMessage error={errorUpdating} />}
    }
  };

  // Lets reset when modal is closed
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={isLoading}>
          {isLoading ? "Asignando..." : "Asignar depósitos"}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Asignar depósitos
            {isLoading && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-normal text-muted-foreground">
                  Procesando...
                </span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {transactions.length > 1
              ? `Elija el cliente al cual se le asignaran los ${transactions.length} depósitos.`
              : "Elija el cliente al cual se le asignara el depósito."}
          </DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput
            placeholder="Buscar cliente..."
            className="h-10"
            disabled={isLoading}
          />
          <CommandList>
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandGroup heading="Resultados">
              {clients?.data.map((client) => (
                <CommandItem
                  key={client.id}
                  className={`cursor-pointer ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  value={`${client.code}`}
                  onSelect={
                    isLoading ? undefined : () => doBulkUpdate(client.id)
                  }
                  disabled={isLoading}
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
