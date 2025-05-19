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
    <div className="flex flex-col gap-y-4">
      <Button
        className="self-start"
        onClick={() => router.push("/clientes/nuevo")}
      >
        <CirclePlus />
        Nuevo Cliente
      </Button>
      <ClientsTable />
    </div>
  );
}
