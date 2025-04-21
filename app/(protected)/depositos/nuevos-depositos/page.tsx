"use client";

import { useAccountId } from "@/app/context/account-provider";
import { useCreateBulkTransactionMutation } from "@/app/lib/transactions/api";
import { mapStringToTransactions } from "@/app/lib/transactions/helpers";
import { Transaction } from "@/app/lib/transactions/types";
import AccountSelector from "@/app/ui/account-selector";
import NewTransactionsTable from "@/app/ui/transactions/new-transactions-table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  transactions: z.string().nonempty("Pegue los depósitos"),
});

export default function NewTransactionsPage() {
  const { selectedAccountId } = useAccountId();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactions: "",
    },
  });

  // Lets just have two states, "initial" state for pasting and "pasted" for showing table
  const [state, setState] = useState<"initial" | "pasted">("initial");
  const [newTransactionsData, setNewTransactionsData] = useState<
    Partial<Transaction>[]
  >([]);

  const [createBulkTransaction, { isLoading: loading }] =
    useCreateBulkTransactionMutation();

  // Excel transactions mapping
  const handleContinue = async (data: z.infer<typeof formSchema>) => {
    try {
      const { valid, invalid } = mapStringToTransactions(data.transactions);
      if (invalid.length > 0) {
        console.warn("❌ Transacciones descartadas:");
        invalid.forEach((err) =>
          console.warn(
            `Fila ${err.index + 1} (${err.reason}):`,
            err.row.join(" | ")
          )
        );
      }

      if (valid.length === 0) {
        alert(
          "⚠️ Todas las transacciones tienen errores. No se pudo procesar ninguna."
        );
        return;
      }

      setNewTransactionsData(valid);
      setState("pasted");
    } catch (error) {
      console.log("🚨 Error parsing transactions:", error);
    }
  };

  // Vulk saving
  const handleSave = async () => {
    if (!selectedAccountId) return;
    try {
      await createBulkTransaction({
        accountId: selectedAccountId,
        transactions: newTransactionsData,
      }).unwrap();

      handleBack();
    } catch (e) {
      console.log(e);
    }
  };

  const handleBack = () => router.back();

  useEffect(() => {
    document.title = "Nuevos depósitos";
  }, []);

  return (
    <div className="flex h-full flex-col gap-y-6">
      {/* Back button */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={handleBack}
      >
        <ArrowLeft />
      </Button>

      <div className="flex items-center justify-between">
        <AccountSelector disable />
        {state === "initial" ? (
          <Button onClick={form.handleSubmit(handleContinue)}>Continuar</Button>
        ) : (
          <Button loading={loading} onClick={handleSave}>
            Guardar todo
          </Button>
        )}
      </div>

      {state === "initial" ? (
        <Form {...form}>
          <form className="h-full flex flex-col">
            <FormField
              control={form.control}
              name="transactions"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Pegar depósitos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <NewTransactionsTable data={newTransactionsData} />
      )}
    </div>
  );
}
