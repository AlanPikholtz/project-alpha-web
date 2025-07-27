"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAccountMutation } from "@/app/lib/accounts/api";
import { Account } from "@/app/lib/accounts/types";
import { toast } from "sonner";
import ApiErrorMessage from "../api-error-message";

interface DeleteAccountDialogProps {
  account: Account;
  onOptimisticDelete?: (id: number | string) => void;
}

export default function DeleteAccountDialog({
  account,
  onOptimisticDelete,
}: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteAccount, { isLoading, reset, error: errorDeleting }] =
    useDeleteAccountMutation();

  const handleDelete = async () => {
    try {
      // Make the API call FIRST
      await deleteAccount({ id: account.id }).unwrap();
      console.log("✅ Account deletion confirmed by backend");

      // Update UI after API success
      if (onOptimisticDelete) {
        console.log(
          "⚡ Removing account from UI after successful deletion",
          account.id
        );
        onOptimisticDelete(account.id);
      }

      // Close dialog and show success
      toast.success("Cuenta eliminada con éxito");
      setOpen(false);
    } catch (error) {
      console.error(
        "❌ Error deleting account, keeping modal open to show error",
        error
      );

      // Don't close modal - let user see the error and try again
      // The modal will automatically show the error via {errorDeleting && <ApiErrorMessage error={errorDeleting} />}
    }
  };

  // Reset when modal is closed
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ¿Eliminar cuenta?
            {isLoading && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-normal text-muted-foreground">
                  Procesando...
                </span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <p>
          Esta acción eliminará permanentemente la cuenta &quot;{account.name}
          &quot;.
        </p>
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
              "Eliminar"
            )}
          </Button>
        </DialogFooter>

        {errorDeleting && <ApiErrorMessage error={errorDeleting} />}
      </DialogContent>
    </Dialog>
  );
}
