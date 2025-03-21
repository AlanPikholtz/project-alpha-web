"use client";

import React from "react";
import AssignTransactionsTable from "../ui/transactions/assign-transactions-table";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <AssignTransactionsTable />
    </div>
  );
}
