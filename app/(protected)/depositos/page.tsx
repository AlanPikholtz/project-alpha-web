import TransactionsTable from "@/app/ui/transactions/transactions-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AccountSelector from "@/app/ui/account-selector";
import { CirclePlus } from "lucide-react";

export const metadata = {
  title: "Depósitos",
};

export default function TransactionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        {/* Dropdown */}
        <AccountSelector />
        {/* New transaccions */}
        <Button asChild>
          <CirclePlus />
          <Link href="/depositos/nuevos-depositos">Nuevos depósitos</Link>
        </Button>
      </div>
      <TransactionsTable />
    </div>
  );
}
