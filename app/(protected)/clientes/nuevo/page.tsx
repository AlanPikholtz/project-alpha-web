import NewClientForm from "@/app/ui/clients/new-client-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function NewClientPage() {
  return (
    <div className="flex h-full flex-col gap-y-5">
      {/* We should define h1, h2, etc. for this stuff */}
      <div className="flex flex-col gap-y-11">
        <label className="text-lg font-medium text-zinc-950 leading-7">
          Nuevo cliente
        </label>
        <Separator />
      </div>
      {/* New client form */}
      <NewClientForm />
    </div>
  );
}
