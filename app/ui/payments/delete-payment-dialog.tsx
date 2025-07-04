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
import { Payment } from "@/app/lib/payments/types";
import { useDeletePaymentMutation } from "@/app/lib/payments/api";

export default function DeletePaymentDialog({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const [deletePayment, { isLoading }] = useDeletePaymentMutation();

  const handleDelete = async () => {
    try {
      await deletePayment({ id: payment.id }).unwrap();
      toast.success("Pago eliminado con éxito");
      setOpen(false);
    } catch (error) {
      toast.error("No se pudo eliminar el pago");
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
          <DialogTitle>¿Eliminar pago?</DialogTitle>
        </DialogHeader>
        <p>
          Esta acción eliminará permanentemente el pago de {payment.clientCode}.
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
