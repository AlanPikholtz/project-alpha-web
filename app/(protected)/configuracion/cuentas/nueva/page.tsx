import CreateAccountForm from "@/app/ui/accounts/create-account-form";
import BackButton from "@/app/ui/back-button";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function NewAccount() {
  return (
    <div className="flex h-full flex-col gap-y-5">
      <BackButton />
      {/* We should define h1, h2, etc. for this stuff */}
      <div className="flex flex-col gap-y-11">
        <label className="text-lg font-medium text-zinc-950 leading-7">
          Agregar cuenta
        </label>
        <Separator />
      </div>
      <CreateAccountForm />
    </div>
  );
}
