"use client";

import { useGetTransactionsQuery } from "@/app/lib/transactions/api";
import React from "react";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const { data } = useGetTransactionsQuery({ id: id as string });

  return (
    <div>
      Transactions
      <ul>
        {data?.map((x) => (
          <li key={x.id}>
            <p>{x.amount}</p>
            <p>{x.createdAt}</p>
            <p>{x.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
