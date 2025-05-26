"use client";
import AccountsTable from "@/app/ui/accounts/accounts-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function SettingsAccountsPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <Button
        className="self-end"
        onClick={() => router.push("/configuracion/cuentas/nueva")}
      >
        Agregar cuenta
      </Button>

      <AccountsTable />
    </div>
  );
}
