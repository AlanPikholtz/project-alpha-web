"use client";

import SideNav from "@/components/dashboard/sidenav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideNav />
      <main className="flex-grow flex flex-col w-full p-6 md:overflow-y-auto md:p-10 md:pb-20">
        {children}
      </main>
    </SidebarProvider>
  );
}
