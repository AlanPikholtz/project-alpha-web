"use client";

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
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SingleDatePicker from "../transactions/filters/single-date-picker";
import PaymentTypeDropdown from "./payment-type-dropdown";

const formSchema = z.object({
  clientId: z.string().nonempty("Ingrese el ID del cliente"),
  type: z.string().nonempty("Ingrese el Nombre"),
  amount: z.string().nonempty("Ingrese el Monto"),
  date: z.date(),
});

export default function NewPaymentForm() {
  const router = useRouter();

  // const [createPayment, { isLoading: loading }] = useCreateClientMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      type: "",
      amount: "",
      date: new Date(),
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // await createClient({
      //   accountId: selectedAccountId,
      //   ...data,
      // }).unwrap();
      // Redirect
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

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
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Id del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PaymentTypeDropdown
                      value={field.value}
                      setValue={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Monto" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SingleDatePicker
                      className="w-full"
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-3.5">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
