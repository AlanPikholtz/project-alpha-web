"use client";

import { useBulkDeleteTransactionMutation } from "@/app/lib/transactions/api";
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

export default function DeleteSingleTransactionModal({
  transaction,
  setOpen,
  onOptimisticDelete,
}: {
  transaction: Partial<Transaction>;
  setOpen: (open: boolean) => void;
  onOptimisticDelete?: (id: number | string) => void;
}) {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const [
    bulkDeleteTransactions,
    { isLoading: deletingTransaction, reset, error: errorDeleting },
  ] = useBulkDeleteTransactionMutation();

  const handleDeleteTransaction = async () => {
    try {
      if (!transaction.id) return;

      // Make the API call FIRST
      await bulkDeleteTransactions({
        transactionIds: [transaction.id],
      }).unwrap();
      console.log("✅ Transaction deletion confirmed by backend");

      // If we have optimistic functions, use them AFTER success
      if (onOptimisticDelete) {
        console.log(
          "⚡ Removing transaction from UI after successful deletion",
          transaction.id
        );

        // Remove from UI after API success
        onOptimisticDelete(transaction.id);
      }

      // Close modals and show success
      toast.success("Depósito eliminado.");
      setOpen(false);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(
        "❌ Error deleting transaction, keeping modal open to show error",
        error
      );

      // Don't close modal - let user see the error and try again
      // The modal will automatically show the error via {errorDeleting && <ApiErrorMessage error={errorDeleting} />}
    }
  };

  // Reset when modal is closed
  useEffect(() => {
    if (!deleteModalOpen) reset();
  }, [deleteModalOpen, reset]);

  return (
    <>
      <hr className="my-1" />
      <CommandGroup>
        <div
          className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-accent hover:text-accent-foreground ${
            deletingTransaction ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={
            deletingTransaction ? undefined : () => setDeleteModalOpen(true)
          }
        >
          {deletingTransaction ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Eliminando...
            </>
          ) : (
            "Eliminar depósito"
          )}
        </div>
      </CommandGroup>

      <Dialog
        open={deleteModalOpen}
        onOpenChange={deletingTransaction ? undefined : setDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              ¿Eliminar depósito?
              {deletingTransaction && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-normal text-muted-foreground">
                    Procesando...
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <p>Esta acción eliminará permanentemente el depósito seleccionado.</p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deletingTransaction}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTransaction}
              disabled={deletingTransaction}
            >
              {deletingTransaction ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>

          {errorDeleting && <ApiErrorMessage error={errorDeleting} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
