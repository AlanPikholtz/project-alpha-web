"use client";

import { useUnassignClientTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { Button } from "@/components/ui/button";
import { CommandGroup } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import ApiErrorMessage from "../../api-error-message";

export default function UnassignTransactionsModal({
  transaction,
  setOpen,
  onOptimisticUpdate,
}: {
  transaction: Partial<Transaction>;
  setOpen: (open: boolean) => void;
  onOptimisticUpdate?: (
    id: number | string,
    updater: (item: Transaction) => Transaction
  ) => void;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [
    unassignClient,
    { isLoading: loadingUnassign, reset, error: errorUpdating },
  ] = useUnassignClientTransactionMutation();

  const handleTransactionUnassign = async () => {
    if (!transaction.id) return;

    try {
      // Make the API call FIRST
      await unassignClient({ transactionId: transaction.id }).unwrap();
      console.log("✅ Client unassignment confirmed by backend");

      // If we have optimistic functions, use them AFTER success
      if (onOptimisticUpdate) {
        console.log(
          "⚡ Updating UI after successful unassignment for transaction",
          transaction.id
        );

        // Update UI after API success
        onOptimisticUpdate(transaction.id, (currentTransaction) => ({
          ...currentTransaction,
          clientId: 0,
          clientFullName: "",
        }));
      }

      // Close modals and show success
      toast.success("Deposito desasignado!");
      setOpen(false);
      setConfirmOpen(false);
    } catch (error) {
      console.error(
        "❌ Error unassigning client, keeping modal open to show error",
        error
      );

      // Don't close modal - let user see the error and try again
      // The modal will automatically show the error via {errorUpdating && <ApiErrorMessage error={errorUpdating} />}
    }
  };

  // Reset when modal is closed
  useEffect(() => {
    if (!confirmOpen) reset();
  }, [confirmOpen, reset]);

  return (
    <>
      <hr className="my-1" />
      <CommandGroup>
        <div
          className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-accent hover:text-accent-foreground ${
            loadingUnassign ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={loadingUnassign ? undefined : () => setConfirmOpen(true)}
        >
          {loadingUnassign ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Desasignando...
            </>
          ) : (
            "Desasignar cliente"
          )}
        </div>
      </CommandGroup>

      <Dialog
        open={confirmOpen}
        onOpenChange={loadingUnassign ? undefined : setConfirmOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              ¿Estás seguro?
              {loadingUnassign && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-normal text-muted-foreground">
                    Procesando...
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <p>Esta acción desasignará el cliente de este depósito.</p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loadingUnassign}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleTransactionUnassign}
              disabled={loadingUnassign}
            >
              {loadingUnassign ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Desasignando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>

          {errorUpdating && <ApiErrorMessage error={errorUpdating} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
