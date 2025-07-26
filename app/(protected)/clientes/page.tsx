"use client";

import ClientsTable from "@/app/ui/clients/clients-table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ClientsPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Clientes";
  }, []);

  return (
    <div className="h-full flex flex-col gap-y-4 overflow-hidden">
      <Button
        className="self-start flex-shrink-0"
        onClick={() => router.push("/clientes/nuevo")}
      >
        <CirclePlus />
        Nuevo Cliente
      </Button>
      <div className="flex-1 min-h-0">
        <ClientsTable />
      </div>
    </div>
  );
}
