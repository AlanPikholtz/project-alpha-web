"use client";

import { useAccountId } from "@/app/context/account-provider";
import { useCreateBulkTransactionMutation } from "@/app/lib/transactions/api";
import {
  stringToISODate,
  stringToTransactionType,
} from "@/app/lib/transactions/helpers";
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
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
      const rows = data.transactions
        .split("\n")
        .map((row) => row.split("\t").map((cell) => cell.trim()));

      const mappedTransactions: Partial<Transaction>[] = rows.map((row) => {
        return {
          date: stringToISODate(row[0]),
          type: stringToTransactionType(row[1]),
          amount: parseFloat(row[2]),
          currency: "ARS", // Hardcoded for now
        };
      });

      setNewTransactionsData(mappedTransactions);
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

  // const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
  //   e.preventDefault(); // Prevent default pasting behavior
  //   const text: string = e.clipboardData.getData("text");

  //   const rows = text
  //     .split("\n")
  //     .map((row) => row.split("\t").map((cell) => cell.trim()));

  //   const parsedTransactions: Partial<Transaction>[] = rows.map((row) => ({
  //     createdAt: row[0], // Keep as string
  //     type: row[1], // Chusmear esto
  //     amount: parseFloat(row[2]), // Ensure correct number format
  //   }));

  //   // setTableData(parsedTransactions);
  // };

  const handleBack = () => router.back();

  return (
    <>
      <Head>
        <title>Nuevos Depositos</title>
      </Head>
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
            <Button onClick={form.handleSubmit(handleContinue)}>
              Continuar
            </Button>
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
    </>
  );
}
