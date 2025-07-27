"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetClientByIdQuery } from "@/app/lib/clients/api";
import { Separator } from "@/components/ui/separator";
import ClientTransactionTable from "@/app/ui/clients/client-transaction-table";
import BackButton from "@/app/ui/back-button";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ClientCurrentBalance from "@/app/ui/clients/client-current-balance";

export default function ClientPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const router = useRouter();

  const { data: client } = useGetClientByIdQuery({
    id: id as unknown as number,
  });

  return (
    <div className="h-full flex flex-col gap-y-5 overflow-hidden">
      <BackButton />

      {/* Header section with fixed height */}
      <div className="flex flex-col gap-y-11 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div
            className="flex flex-row items-center gap-x-2 hover:underline hover:cursor-pointer"
            onClick={() => router.push(`/clientes/${id}/editar`)}
          >
            <label className="text-xl font-medium text-zinc-950 leading-7">
              {client?.firstName} {client?.lastName}
            </label>
            <EditIcon className="text-zinc-950" size={18} />
          </div>

          <ClientCurrentBalance client={client} />
        </div>
        <Separator />
      </div>

      {/* Table section that grows to fill remaining space */}
      <div className="flex-1 min-h-0">
        <ClientTransactionTable client={client} />
      </div>
    </div>
  );
}
