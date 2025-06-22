import { Client } from "@/app/lib/clients/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import DeleteClientDialog from "./delete-client-dialog";

export default function ClientActions({ client }: { client: Client }) {
  const router = useRouter();
  return (
    <div className="flex justify-center">
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/clientes/${client.id}`);
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <DeleteClientDialog client={client} />
    </div>
  );
}
