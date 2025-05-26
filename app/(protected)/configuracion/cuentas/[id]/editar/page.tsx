"use client";
import { useGetAccountByIdQuery } from "@/app/lib/accounts/api";
import UpdateAccountForm from "@/app/ui/accounts/update-account-form";
import BackButton from "@/app/ui/back-button";
import LoadingSpinner from "@/app/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import React from "react";

export default function EdtiAccountPage() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const { data: account, isLoading: loading } = useGetAccountByIdQuery({
    id: id as unknown as number,
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!account) {
    return (
      <div className="flex h-full flex-col gap-y-5">
        <BackButton />
        {/* We should define h1, h2, etc. for this stuff */}
        <div className="flex flex-col gap-y-11">
          <label className="text-lg font-medium text-zinc-950 leading-7">
            Algo salio mal
          </label>
          <Separator />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-y-5">
      <BackButton />
      {/* We should define h1, h2, etc. for this stuff */}
      <div className="flex flex-col gap-y-11">
        <label className="text-lg font-medium text-zinc-950 leading-7">
          Editar cuenta
        </label>
        <Separator />
      </div>
      <UpdateAccountForm account={account} />
    </div>
  );
}
