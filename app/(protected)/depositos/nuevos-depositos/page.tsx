"use client";

import { mapStringToTransactions } from "@/app/lib/transactions/helpers";
import { Transaction } from "@/app/lib/transactions/types";
import AccountSelector from "@/app/ui/account-selector";
import DuplicatedTransactionsModal from "@/app/ui/transactions/duplicated-transactions-modal";
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
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactions: "",
    },
  });

  const pastedDataWatch = form.watch("transactions");

  // Lets just have two states, "initial" state for pasting and "pasted" for showing table
  const [state, setState] = useState<"initial" | "pasted">("initial");
  const [newTransactionsData, setNewTransactionsData] = useState<
    Partial<Transaction>[]
  >([]);
  const [duplicatedTransactions, setDuplicatedTransactions] = useState<
    Partial<Transaction>[]
  >([]);
  const [duplicatedModalOpen, setDuplicatedModalOpen] =
    useState<boolean>(false);

  // Excel transactions mapping
  const handleContinue = async (data: z.infer<typeof formSchema>) => {
    try {
      const { valid, duplicates, invalid } = mapStringToTransactions(
        data.transactions
      );

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
      setDuplicatedTransactions(duplicates);
      setState("pasted");
    } catch (error) {
      console.log("🚨 Error parsing transactions:", error);
    }
  };

  const handleBack = () => router.back();

  useEffect(() => {
    if (duplicatedTransactions.length === 0) return;
    setDuplicatedModalOpen(true);
  }, [duplicatedTransactions]);
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

      {state === "initial" ? (
        <div className="flex items-center justify-between">
          <AccountSelector disable />
          <Button
            disabled={pastedDataWatch.length === 0}
            onClick={form.handleSubmit(handleContinue)}
          >
            Continuar
          </Button>
        </div>
      ) : null}

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
        <>
          <NewTransactionsTable data={newTransactionsData} />
          <DuplicatedTransactionsModal
            open={duplicatedModalOpen}
            transactions={duplicatedTransactions}
            onClose={setDuplicatedModalOpen}
          />
        </>
      )}
    </div>
  );
}
