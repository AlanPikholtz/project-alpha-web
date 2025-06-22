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
}: {
  transactions: Transaction[];
  onSuccessDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [bulkDelete, { isLoading, error, reset }] =
    useBulkDeleteTransactionMutation();

  const handleDelete = async () => {
    try {
      await bulkDelete({
        transactionIds: transactions.map((t) => t.id),
      }).unwrap();
      toast.success("Depósitos eliminados con éxito");
      setOpen(false);
      onSuccessDelete();
    } catch (e) {
      toast.error("No se pudieron eliminar los depósitos");
      console.log(e);
    }
  };

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex gap-2">
          <Trash2 className="w-4 h-4" />
          {transactions.length > 1 ? `Eliminar depósitos` : `Eliminar depósito`}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar depósitos?</DialogTitle>
          <DialogDescription>
            {transactions.length > 1
              ? `Esta acción eliminará los ${transactions.length} depósitos seleccionados.`
              : `Esta acción eliminará el depósito seleccionado.`}
          </DialogDescription>
        </DialogHeader>

        {error && <ApiErrorMessage error={error} />}

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
