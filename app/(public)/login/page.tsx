import LoginForm from "@/components/auth/login-form";
import React from "react";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-black/90">
      <div className="flex w-full max-w-[400px] flex-col">
        <LoginForm />
      </div>
    </main>
  );
}
