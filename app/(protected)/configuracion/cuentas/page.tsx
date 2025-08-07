"use client";
import AccountsTable from "@/app/ui/accounts/accounts-table";
import CreateAccountDialog from "@/app/ui/accounts/create-account-dialog";
import React, { useState } from "react";
import { Account } from "@/app/lib/accounts/types";

export default function SettingsAccountsPage() {
  // State to hold optimistic functions from AccountsTable
  const [optimisticFunctions, setOptimisticFunctions] = useState<{
    optimisticAdd: (item: Account) => void;
    refresh: () => Promise<void>;
  } | null>(null);

  return (
    <div className="flex flex-col gap-y-4 h-full">
      <CreateAccountDialog
        onOptimisticAdd={optimisticFunctions?.optimisticAdd}
      />
      <AccountsTable onOptimisticFunctionsReady={setOptimisticFunctions} />
    </div>
  );
}
