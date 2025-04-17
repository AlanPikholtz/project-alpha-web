"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountProvider } from "../context/account-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <SidebarProvider>
        <SideNav />
        <main className="flex-grow flex flex-col w-full p-6 md:overflow-y-auto md:p-10 md:pb-20">
          {children}
        </main>
      </SidebarProvider>
    </AccountProvider>
  );
}
