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
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { clearSessionData } from "@/app/lib/auth/authSlice";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { useState } from "react";

const menuItems = [
  { title: "Totalitarias", url: "/" },
  { title: "Depósitos", url: "/depositos" },
  { title: "Pagos", url: "/pagos" },
  { title: "Clientes", url: "/clientes" },
];

export default function SideNav() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [showSignOutDialog, setShowSignOutDialog] = useState<boolean>(false);

  const handleSignOut = () => {
    dispatch(clearSessionData());
    setShowSignOutDialog(false);
  };

  return (
    <>
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
                        ? "hover:bg-neutral-900 bg-neutral-900 hover:text-white text-white"
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
              <SidebarMenuButton
                className="text-[#A1A1AA]"
                onClick={() => setShowSignOutDialog(true)}
              >
                <LogOut /> Cerrar sesión
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Sign Out Modal */}
      {/* Outside of dropdown context */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quiere cerrar la sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Puedes volver a iniciar sesión en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
