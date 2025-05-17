"use client";

import PaymentsTable from "@/app/ui/payments/payments-table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function PaymentsPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Pagos";
  }, []);

  return (
    <div className="flex flex-col gap-y-6.5">
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
