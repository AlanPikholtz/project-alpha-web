"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Transaction } from "@/app/lib/transactions/types";
import { toast } from "sonner";
import ApiErrorMessage from "../api-error-message";
import { useBulkDeleteTransactionMutation } from "@/app/lib/transactions/api";

export default function DeleteTransactionsModal({
  transactions,
  onSuccessDelete,
  onOptimisticDelete,
}: {
  transactions: Transaction[];
  onSuccessDelete: () => void;
  onOptimisticDelete?: (id: number | string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [bulkDelete, { isLoading, error, reset }] =
    useBulkDeleteTransactionMutation();

  const handleDelete = async () => {
    try {
      // Make the API call FIRST
      await bulkDelete({
        transactionIds: transactions.map((t) => t.id),
      }).unwrap();
      console.log("✅ Bulk deletion confirmed by backend");

      // If we have optimistic functions, use them AFTER success
      if (onOptimisticDelete) {
        console.log(
          "⚡ Removing transactions from UI after successful deletion"
        );
        // Remove all transactions from UI after API success
        transactions.forEach((transaction) => {
          onOptimisticDelete(transaction.id);
        });
      }

      // Close modal and show success
      toast.success(
        `${transactions.length} depósito${
          transactions.length > 1 ? "s" : ""
        } eliminado${transactions.length > 1 ? "s" : ""} con éxito`
      );
      setOpen(false);
      onSuccessDelete();
    } catch (error) {
      console.error(
        "❌ Error deleting transactions, keeping modal open to show error",
        error
      );
      // Don't close modal - let user see the error and try again
      // The modal will automatically show the error via {error && <ApiErrorMessage error={error} />}
    }
  };

  // Reset when modal is closed
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          <Trash2 className="h-4 w-4 mr-2" />
          {isLoading ? "Eliminando..." : "Eliminar depósitos"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ¿Eliminar {transactions.length} depósito
            {transactions.length > 1 ? "s" : ""}?
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
            Esta acción eliminará permanentemente {transactions.length} depósito
            {transactions.length > 1 ? "s" : ""} seleccionado
            {transactions.length > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
        {error && <ApiErrorMessage error={error} />}
      </DialogContent>
    </Dialog>
  );
}
