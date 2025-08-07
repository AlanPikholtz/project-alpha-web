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
    <div className="h-full flex flex-col gap-y-6 overflow-hidden">
      <div className="flex items-center justify-between flex-shrink-0">
        {/* Dropdown */}
        <AccountSelector />
        {/* New transaccions */}
        <Button asChild>
          <Link
            href="/depositos/nuevos-depositos"
            className="flex items-center gap-2"
          >
            <CirclePlus />
            Nuevos depósitos
          </Link>
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <TransactionsTable />
      </div>
    </div>
  );
}
