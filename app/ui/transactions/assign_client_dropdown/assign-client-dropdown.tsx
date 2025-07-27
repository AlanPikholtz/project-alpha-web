"use client";

import { useAccountId } from "@/app/context/account-provider";
import { useGetClientsQuery } from "@/app/lib/clients/api";
import { useBulkUpdateTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction, TransactionStatus } from "@/app/lib/transactions/types";
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
import React, { useEffect } from "react";
import UnassignTransactionsModal from "./unassign-transactions-modal";
import DeleteSingleTransactionModal from "./delete-single-transaction-modal";
import ApiErrorMessage from "../../api-error-message";

interface AssignClientDropdownProps {
  transaction: Partial<Transaction>;
  onOptimisticUpdate?: (
    id: number | string,
    updater: (item: Transaction) => Transaction,
    isAssigning?: boolean
  ) => void;
  onOptimisticDelete?: (id: number | string) => void;
  statusFilter?: TransactionStatus | undefined;
}

export default function AssignClientDropdown({
  transaction,
  onOptimisticUpdate,
  onOptimisticDelete,
  statusFilter, // eslint-disable-line @typescript-eslint/no-unused-vars
}: AssignClientDropdownProps) {
  const { selectedAccountId } = useAccountId();

  const { data: clients } = useGetClientsQuery(
    {
      accountId: selectedAccountId,
      limit: 0,
    },
    { skip: !selectedAccountId }
  );

  const [
    bulkUpdateTransactions,
    { isLoading: updatingLoading, error: errorUpdating, reset },
  ] = useBulkUpdateTransactionMutation();

  const [open, setOpen] = React.useState(false);

  const handleBulkUpdate = async (clientId: number) => {
    if (!transaction.id) return;

    try {
      // Find the selected client
      const selectedClient = clients?.data.find((c) => c.id === clientId);
      if (!selectedClient) return;

      // 1. Make the API call FIRST
      await bulkUpdateTransactions({
        clientId,
        transactionIds: [transaction.id],
      }).unwrap();
      console.log("✅ Client assignment confirmed by backend");

      // 2. If we have optimistic functions, use them AFTER success
      if (onOptimisticUpdate) {
        console.log(
          "⚡ Optimistically assigning client",
          selectedClient.firstName,
          selectedClient.lastName,
          "to transaction",
          transaction.id
        );
        onOptimisticUpdate(
          transaction.id,
          (currentTransaction) => ({
            ...currentTransaction,
            clientId: clientId,
            clientFullName: `${selectedClient.firstName} ${selectedClient.lastName}`,
          }),
          true
        ); // isAssigning = true
      }

      // 3. Close dropdown only after successful API call
      setOpen(false);
    } catch (error) {
      console.error(
        "❌ Error assigning client, keeping dropdown open to show error",
        error
      );
      // Don't close dropdown - let user see the error and try again
      // The error will be displayed via {errorUpdating && <ApiErrorMessage error={errorUpdating} />}
    }
  };

  // Reset when dropdown is closed
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  if (updatingLoading) {
    return (
      <div className="h-10 flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={updatingLoading ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between min-w-[120px]"
          disabled={updatingLoading}
        >
          {updatingLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Asignando...
            </>
          ) : (
            <>
              {transaction.clientFullName || "Asignar cliente"}
              <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar cliente..."
            className="h-9"
            disabled={updatingLoading}
          />
          <CommandList>
            <CommandGroup heading="Clientes disponibles">
              {clients?.data.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.code}`}
                  className={
                    updatingLoading ? "opacity-50 cursor-not-allowed" : ""
                  }
                  onSelect={
                    updatingLoading
                      ? undefined
                      : () => handleBulkUpdate(client.id)
                  }
                  disabled={updatingLoading}
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

            {(!transaction.clientId || transaction.clientId === 0) && (
              <DeleteSingleTransactionModal
                transaction={transaction}
                setOpen={setOpen}
                onOptimisticDelete={onOptimisticDelete}
              />
            )}
            {Boolean(transaction.clientId) && (
              <UnassignTransactionsModal
                transaction={transaction}
                setOpen={setOpen}
                onOptimisticUpdate={onOptimisticUpdate}
              />
            )}
            {errorUpdating && <ApiErrorMessage error={errorUpdating} />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
