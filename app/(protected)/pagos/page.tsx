"use client";

import PaymentsTable from "@/app/ui/payments/payments-table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <div>
      <Button
        className="self-start"
        onClick={() => router.push("/pagos/nuevo")}
      >
        <CirclePlus />
        Nuevo Pago
      </Button>
      <PaymentsTable />
    </div>
  );
}
