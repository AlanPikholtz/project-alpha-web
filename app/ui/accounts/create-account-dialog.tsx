"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAccountMutation } from "@/app/lib/accounts/api";
import { Account } from "@/app/lib/accounts/types";
import { Loader2 } from "lucide-react";
import ApiErrorMessage from "../api-error-message";

const formSchema = z.object({
  name: z.string().nonempty("Ingrese el nombre de la cuenta"),
});

interface CreateAccountDialogProps {
  onOptimisticAdd?: (item: Account) => void;
}

export default function CreateAccountDialog({
  onOptimisticAdd,
}: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [createAccount, { isLoading, reset, error: errorCreating }] =
    useCreateAccountMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Make the API call FIRST
      const result = await createAccount(data).unwrap();
      console.log(
        "✅ Account creation confirmed by backend with ID",
        result.id
      );

      // Update UI after API success
      if (onOptimisticAdd) {
        const newAccount: Account = {
          id: result.id,
          name: data.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log(
          "⚡ Adding new account to list after successful creation",
          newAccount.name
        );
        onOptimisticAdd(newAccount);
      }

      // Close dialog and show success
      toast.success("Cuenta creada con éxito");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(
        "❌ Error creating account, keeping modal open to show error",
        error
      );

      // Don't close modal - let user see the error and try again
      // The modal will automatically show the error via {errorCreating && <ApiErrorMessage error={errorCreating} />}
    }
  };

  // Reset when modal is closed
  useEffect(() => {
    if (!open) {
      reset();
      form.reset();
    }
  }, [open, reset, form]);

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isLoading} className="self-end">
          {isLoading ? "Creando..." : "Nueva cuenta"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Crear nueva cuenta
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la cuenta"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </DialogFooter>

            {errorCreating && <ApiErrorMessage error={errorCreating} />}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
