"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronUp, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { clearSessionData } from "@/app/lib/auth/authSlice";
import { cn } from "@/app/lib/utils";

const menuItems = [
  { title: "Totalitarias", url: "/" },
  { title: "Depósitos", url: "/depositos" },
  { title: "Pagos", url: "/pagos" },
  { title: "Clientes", url: "/clientes" },
];

export default function SideNav() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleSignOut = () => {
    dispatch(clearSessionData());
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className={cn(
                    "rounded-md px-3 py-2 transition-colors",
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "hover:bg-neutral-200 text-black"
                  )}
                >
                  <Link className="w-full" href={item.url}>
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings /> Configuracion
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="flex w-full">
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
