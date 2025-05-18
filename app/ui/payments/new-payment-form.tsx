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
import { useCreatePaymentMutation } from "@/app/lib/payments/api";
import { Payment, PaymentMethod } from "@/app/lib/payments/types";
import ClientSelector from "../client-selector";

const formSchema = z.object({
  clientId: z.string().nonempty("Ingrese el ID del cliente"),
  method: z.string().nonempty("Ingrese el tipo"),
  amount: z.string().nonempty("Ingrese el Monto"),
  paymentRequestDate: z.date(),
});

export default function NewPaymentForm() {
  const router = useRouter();

  const [createPayment, { isLoading: loading }] = useCreatePaymentMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      method: "",
      amount: "",
      paymentRequestDate: new Date(),
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { clientId, amount, method, paymentRequestDate } = data;
    try {
      const newPayment: Partial<Payment> = {
        amount,
        clientId: +clientId,
        method: method as PaymentMethod,
        paymentRequestDate: paymentRequestDate.toISOString(),
        currency: "ARS", // Default for now
      };
      await createPayment(newPayment).unwrap();
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
                    <ClientSelector
                      allClients
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
              name="method"
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
              render={({ field }) => {
                return (
                  <FormControl>
                    <Input
                      placeholder="$ 0,00"
                      type="number"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                );
              }}
            />
            <FormField
              control={form.control}
              name="paymentRequestDate"
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
          <Button type="submit" loading={loading}>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
