"use client";

import ClientsTable from "@/components/clients/clients-table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ClientsPage() {
  const router = useRouter();

  return (
    <div>
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
