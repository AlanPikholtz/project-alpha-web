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
import { toast } from "sonner";
import { Client } from "@/app/lib/clients/types";
import { useDeleteClientMutation } from "@/app/lib/clients/api";
import ApiErrorMessage from "../api-error-message";

interface DeleteClientDialogProps {
  client: Client;
  onOptimisticDelete?: (id: number | string) => void;
}

export default function DeleteClientDialog({
  client,
  onOptimisticDelete,
}: DeleteClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteClient, { isLoading, reset, error: errorDeleting }] =
    useDeleteClientMutation();

  const handleDelete = async () => {
    try {
      // Make the API call FIRST
      await deleteClient({ id: client.id }).unwrap();
      console.log("✅ Client deletion confirmed by backend");

      // Update UI after API success
      if (onOptimisticDelete) {
        console.log(
          "⚡ Removing client from UI after successful deletion",
          client.id
        );
        onOptimisticDelete(client.id);
      }

      // Close dialog and show success
      toast.success("Cliente eliminado con éxito");
      setOpen(false);
    } catch (error) {
      console.error(
        "❌ Error deleting client, keeping modal open to show error",
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
            ¿Eliminar cliente?
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
          Esta acción eliminará permanentemente a {client.firstName}{" "}
          {client.lastName}.
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
