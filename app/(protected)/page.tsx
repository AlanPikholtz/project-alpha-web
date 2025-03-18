"use client";

import React, { useState } from "react";
import Clients from "../ui/dashboard/clients";
import ExcelDropzone from "../ui/excel-dropzone";
import { Transaction } from "../lib/transactions/types";
import TransactionCard from "../ui/transaction-card";
import { useGetClientsQuery } from "../lib/clients/api";

export default function Dashboard() {
  const [data, setData] = useState<Partial<Transaction>[]>([]);

  const { data: clients } = useGetClientsQuery();

  console.log(data);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center border rounded h-full border-black/10">
        {data.length === 0 ? <ExcelDropzone onFileRead={setData} /> : null}
        {data.length > 0 && (
          <div className="flex gap-y-4 flex-col overflow-y-auto w-full p-4 bg-white shadow-md rounded h-full">
            {data.map((x, i) => (
              <TransactionCard key={i} transaction={x} clients={clients} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
