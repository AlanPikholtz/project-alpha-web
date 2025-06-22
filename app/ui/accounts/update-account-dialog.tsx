"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Account } from "@/app/lib/accounts/types";
import { useUpdateAccountMutation } from "@/app/lib/accounts/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("Ingrese el nombre de la cuenta"),
});

export default function UpdateAccountDialog({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);

  const [updateAccount, { isLoading: loading }] = useUpdateAccountMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account.name,
    },
  });

  const currentName = form.watch("name")?.trim();
  const originalName = account.name.trim();
  const isSameName = currentName === originalName;

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateAccount({
        id: account.id,
        ...data,
      }).unwrap();
      // Redirect
      setOpen(false);
      // Toast
      toast.success("La cuenta ha sido actualizada.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cuenta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-3.5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex self-end gap-3.5">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading} disabled={isSameName}>
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
