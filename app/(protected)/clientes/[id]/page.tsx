"use client";

import { useGetClientByIdQuery } from "@/app/lib/clients/api";
import BackButton from "@/app/ui/back-button";
import ClientCurrentBalance from "@/app/ui/clients/client-current-balance";
import ClientTransactionTable from "@/app/ui/clients/client-transaction-table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EditIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ClientPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const router = useRouter();

  const { data: client, isLoading } = useGetClientByIdQuery({
    id: id as unknown as number,
  });

  if (isLoading || !client) {
    return <Skeleton className="w-full h-full" />;
  }

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
