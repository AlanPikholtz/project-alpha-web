"use client";

import { useBulkDeleteTransactionMutation } from "@/app/lib/transactions/api";
import { Transaction } from "@/app/lib/transactions/types";
import { Button } from "@/components/ui/button";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DeleteSingleTransactionModal({
  transaction,
  setOpen,
}: {
  transaction: Partial<Transaction>;
  setOpen: (open: boolean) => void;
}) {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const [bulkDeleteTransactions, { isLoading: deletingTransaction }] =
    useBulkDeleteTransactionMutation();

  const handleDeleteTransaction = async () => {
    try {
      if (!transaction.id) return;
      await bulkDeleteTransactions({
        transactionIds: [transaction.id],
      }).unwrap();
      toast.success("Depósito eliminado.");
      setOpen(false);
      setDeleteModalOpen(false);
    } catch (e) {
      toast.error("No se pudo eliminar el depósito.");
      console.log(e);
    }
  };

  return (
    <>
      <hr className="my-1" />
      <CommandGroup>
        <CommandItem
          className="text-red-600"
          onSelect={() => setDeleteModalOpen(true)}
        >
          {deletingTransaction ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            "Eliminar depósito"
          )}
        </CommandItem>
      </CommandGroup>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar depósito?</DialogTitle>
          </DialogHeader>
          <p>Esta acción eliminará permanentemente el depósito seleccionado.</p>
          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTransaction}
              disabled={deletingTransaction}
            >
              {deletingTransaction ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
