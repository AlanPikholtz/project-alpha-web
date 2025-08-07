"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/app/lib/clients/types";
import DeleteClientDialog from "./delete-client-dialog";

interface ClientActionsProps {
  client: Client;
  onOptimisticDelete?: (id: number | string) => void;
}

export default function ClientActions({
  client,
  onOptimisticDelete,
}: ClientActionsProps) {
  const router = useRouter();
  return (
    <div className="flex justify-center">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => router.push(`/clientes/${client.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <DeleteClientDialog
        client={client}
        onOptimisticDelete={onOptimisticDelete}
      />
    </div>
  );
}
