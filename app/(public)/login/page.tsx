import LoginForm from "@/app/ui/auth/login-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function LoginPage() {
  return (
    <main className="flex w-full h-screen border">
      <div className="flex-1 bg-[#F4F4F4]" />
      <div className="flex-1 flex-col flex items-center justify-center border">
        <div className="flex flex-col gap-y-6 max-w-[350px]">
          <div className="flex flex-col gap-y-2 items-center">
            <p className="text-2xl font-bold">Recaudadora</p>
            <p className="text-zinc-500">
              Ingresa tu usuario y contraseña para entrar al sistema
            </p>
          </div>
          <LoginForm />
          <div className="flex items-center gap-x-5">
            <Separator className="flex-1" />
            <p className="text-xs text-zinc-500">Quiero ser cliente</p>
            <Separator className="flex-1" />
          </div>
        </div>
      </div>
    </main>
  );
}
