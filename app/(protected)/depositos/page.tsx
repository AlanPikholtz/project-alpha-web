"use client";

import TransactionsTable from "@/app/ui/transactions/transactions-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AccountSelector from "@/app/ui/account-selector";

export default function TransactionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        {/* Dropdown */}
        <AccountSelector />
        {/* New transaccions */}
        <Button asChild>
          <Link href="/depositos/nuevos-depositos">Nuevas Transacciones</Link>
        </Button>
      </div>
      <TransactionsTable />
    </div>
  );
}
