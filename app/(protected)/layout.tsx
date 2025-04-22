"use client";

import SideNav from "@/app/ui/sidebar/side-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountProvider } from "../context/account-provider";
import { useGetClientsQuery } from "../lib/clients/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Lets get all clients for later usage (cache will be used)
  useGetClientsQuery({ limit: 0 });
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
