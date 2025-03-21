"use client";

import { useGetClientsQuery } from "@/app/lib/clients/api";
import { useRouter } from "next/navigation";
import React from "react";

export default function ClientsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useGetClientsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <ul>
      {data?.map((x) => (
        <li
          className="cursor-pointer"
          key={x.id}
          onClick={() => router.push(`/clients/${x.id}`)}
        >
          {x.name}
        </li>
      ))}
    </ul>
  );
}
