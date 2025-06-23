"use client";

import { useState } from "react";
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

export default function DeleteAccountDialog({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const handleDelete = async () => {
    try {
      await deleteAccount({ id: account.id }).unwrap();
      toast.success("Cuenta eliminada con éxito");
      setOpen(false);
    } catch (error) {
      toast.error("No se pudo eliminar la cuenta");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar cuenta?</DialogTitle>
        </DialogHeader>
        <p>Esta acción eliminará permanentemente esta cuenta.</p>
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
