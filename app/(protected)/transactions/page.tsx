import AssignTransactionsTable from "@/app/ui/transactions/assign-transactions-table";
import React from "react";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col h-full">
      <h1>Transacciones</h1>
      <AssignTransactionsTable />
    </div>
  );
}
