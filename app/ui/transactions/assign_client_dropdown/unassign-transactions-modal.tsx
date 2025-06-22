"use client";

import { useUnassignClientTransactionMutation } from "@/app/lib/transactions/api";
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

export default function UnassignTransactionsModal({
  transaction,
  setOpen,
}: {
  transaction: Partial<Transaction>;
  setOpen: (open: boolean) => void;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [unassignClient, { isLoading: loadingUnassign }] =
    useUnassignClientTransactionMutation();

  const handleTransactionUnassign = async () => {
    if (!transaction.id) return;
    try {
      await unassignClient({ transactionId: transaction.id }).unwrap();
      toast.success("Deposito desasignado!");
      setOpen(false);
    } catch (error) {
      console.error("Error al desasignar el cliente", error);
    }
  };
  return (
    <>
      <hr className="my-1" />
      <CommandGroup>
        <CommandItem
          className="text-red-600"
          onSelect={() => setConfirmOpen(true)}
        >
          {loadingUnassign ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            "Desasignar cliente"
          )}
        </CommandItem>
      </CommandGroup>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>
          <p>Esta acción desasignará el cliente de este depósito.</p>
          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleTransactionUnassign();
                setConfirmOpen(false);
              }}
              disabled={loadingUnassign}
            >
              {loadingUnassign ? (
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
