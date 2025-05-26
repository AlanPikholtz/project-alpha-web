"use client";
import { useUpdateAccountMutation } from "@/app/lib/accounts/api";
import { Account } from "@/app/lib/accounts/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("Ingrese el nombre de la cuenta"),
});

export default function UpdateAccountForm({ account }: { account: Account }) {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const router = useRouter();

  const [updateAccount, { isLoading: loading }] = useUpdateAccountMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account.name,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateAccount({
        id: id as unknown as number,
        ...data,
      }).unwrap();
      // Redirect
      router.back();
      // Toast
      toast("La cuenta ha sido actualizada.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => router.back();

  return (
    <Form {...form}>
      <form
        className="flex-1 max-w-xl"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="h-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-3.5">
          <Button type="submit" loading={loading}>
            Guardar
          </Button>
          <Button variant="secondary" type="button" onClick={handleBack}>
            Atrás
          </Button>
        </div>
      </form>
    </Form>
  );
}
