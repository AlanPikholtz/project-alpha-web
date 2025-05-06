import BackButton from "@/app/ui/back-button";
import NewPaymentForm from "@/app/ui/payments/new-payment-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const metadata = {
  title: "Nuevo Pago",
};

export default function NewPaymentPage() {
  return (
    <div className="flex h-full flex-col gap-y-5">
      <BackButton />
      {/* We should define h1, h2, etc. for this stuff */}
      <div className="flex flex-col gap-y-11">
        <label className="text-lg font-medium text-zinc-950 leading-7">
          Nuevo pago
        </label>
        <Separator />
      </div>
      {/* New Payment form */}
      <NewPaymentForm />
    </div>
  );
}
