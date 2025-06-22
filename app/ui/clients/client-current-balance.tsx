import { useUpdateClientBalanceMutation } from "@/app/lib/clients/api";
import { Client } from "@/app/lib/clients/types";
import { formatNumber } from "@/app/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ClientCurrentBalance({ client }: { client?: Client }) {
  const [open, setOpen] = useState(false);
  const [newBalance, setNewBalance] = useState(
    client?.balance.toString() || ""
  );

  const [updateClientBalance, { isLoading: updating }] =
    useUpdateClientBalanceMutation();

  const formattedBalance = useMemo(() => {
    if (!client) return;
    return formatNumber(+client.balance, {
      style: "currency",
      currency: "ARS",
    });
  }, [client]);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    setNewBalance("");
  }, []);

  const handleSaveBalance = useCallback(async () => {
    if (!client?.id) return;
    try {
      await updateClientBalance({
        id: client.id,
        balance: parseFloat(newBalance),
      }).unwrap();
      setOpen(false);
      toast.success("El balance ah sido actualizado.");
    } catch (e) {
      console.error(e);
      toast.error(
        `Occurrio un error al actualizar el balance: ${JSON.stringify(e)}`
      );
    }
  }, [client?.id, newBalance, updateClientBalance]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="flex items-center gap-x-2">
        <span className="text-[#71717A]">Saldo Actual:</span>
        <DialogTrigger asChild>
          <div className="flex items-center gap-x-1 hover:underline hover:cursor-pointer">
            <span className="text-xl font-medium text-zinc-950 leading-7">
              AR{formattedBalance}
            </span>
            <Pencil size={16} className="text-zinc-500" />
          </div>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar balance</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Saldo anterior:
            </label>
            <p className="text-lg font-medium">AR{formattedBalance}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Nuevo saldo:
            </label>
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveBalance} disabled={updating}>
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
