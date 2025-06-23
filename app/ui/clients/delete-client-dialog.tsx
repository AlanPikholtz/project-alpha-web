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
import { toast } from "sonner";
import { Client } from "@/app/lib/clients/types";
import { useDeleteClientMutation } from "@/app/lib/clients/api";

export default function DeleteClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const [deleteAccount, { isLoading }] = useDeleteClientMutation();

  const handleDelete = async () => {
    try {
      await deleteAccount({ id: client.id }).unwrap();
      toast.success("Cliente eliminada con éxito");
      setOpen(false);
    } catch (error) {
      toast.error("No se pudo eliminar el cliente");
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
          <DialogTitle>¿Eliminar cliente?</DialogTitle>
        </DialogHeader>
        <p>
          Esta acción eliminará permanentemente a {client.firstName}{" "}
          {client.lastName}.
        </p>
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
