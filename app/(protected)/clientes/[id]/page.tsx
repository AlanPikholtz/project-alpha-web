"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetClientByIdQuery } from "@/app/lib/clients/api";
import { Separator } from "@/components/ui/separator";
import ClientTransactionTable from "@/app/ui/clients/client-transaction-table";

export default function ClientPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const { data: client } = useGetClientByIdQuery({
    id: id as unknown as number,
  });

  const formattedBalance = useMemo(() => {
    if (!client) return;
    const formatted = new Intl.NumberFormat("es-AR", {
      // Argetina formatting
      style: "currency",
      currency: "ARS",
    }).format(+client.balance);

    return formatted;
  }, [client]);

  return (
    <div className="flex h-full flex-col gap-y-5">
      {/* We should define h1, h2, etc. for this stuff */}
      <div className="flex flex-col gap-y-11">
        <div className="flex items-center justify-between">
          <label className="text-xl font-medium text-zinc-950 leading-7">
            {client?.firstName} {client?.lastName}
          </label>

          <label className="text-xl font-medium text-zinc-950 leading-7">
            <span className="text-[#71717A]">Saldo Actual:</span> AR
            {formattedBalance}
          </label>
        </div>
        <Separator />
      </div>

      <ClientTransactionTable />
    </div>
  );
}
