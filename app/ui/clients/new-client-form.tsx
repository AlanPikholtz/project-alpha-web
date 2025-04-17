"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import AccountSelector from "../account-selector";
import { useCreateClientMutation } from "@/app/lib/clients/api";
import { useAccountId } from "@/app/context/account-provider";

const formSchema = z.object({
  lastName: z.string().nonempty("Ingrese el Apellido"),
  firstName: z.string().nonempty("Ingrese el Nombre"),
  code: z.string().nonempty("Ingrese el Código"),
  balance: z.string().nonempty("Ingrese el Saldo"),
  commission: z.string().nonempty("Ingrese la comisión"),
  notes: z.string(),
});
export default function NewClientForm() {
  const router = useRouter();

  const { selectedAccountId } = useAccountId();

  const [createClient, { isLoading: loading }] = useCreateClientMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      code: "",
      balance: "",
      commission: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedAccountId) return;
    try {
      await createClient({
        accountId: selectedAccountId,
        ...data,
      }).unwrap();
      // Redirect
      router.back();
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Apellido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Código único" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Saldo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Comisión" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Observaciones (No obligatorias)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Just for testing */}
            <AccountSelector />
          </div>
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
