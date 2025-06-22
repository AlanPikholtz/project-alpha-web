"use client";
import AccountsTable from "@/app/ui/accounts/accounts-table";
import CreateAccountDialog from "@/app/ui/accounts/create-account-dialog";
import React from "react";

export default function SettingsAccountsPage() {
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <CreateAccountDialog />
      <AccountsTable />
    </div>
  );
}
