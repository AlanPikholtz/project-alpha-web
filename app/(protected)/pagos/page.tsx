"use client";

import PaymentsTable from "@/app/ui/payments/payments-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PaymentsPage() {
  const router = useRouter();

  // Amount search
  const [amountFilter, setAmountFilter] = useState<string>("");

  useEffect(() => {
    document.title = "Pagos";
  }, []);

  return (
    <div className="flex flex-col gap-y-6.5">
      <div className="flex items-center justify-between">
        <Button
          className="self-start"
          onClick={() => router.push("/pagos/nuevo")}
        >
          <CirclePlus />
          Nuevo Pago
        </Button>

        <Input
          className="max-w-sm"
          placeholder="Buscar monto"
          value={amountFilter}
          type="number"
          onChange={(e) => setAmountFilter(e.target.value)}
        />
      </div>
      <PaymentsTable amountFilter={amountFilter} />
    </div>
  );
}
