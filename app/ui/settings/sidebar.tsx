"use client";

import { cn } from "@/app/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Totalitarias", href: "/configuracion/totalitarias" },
  { label: "Cuentas", href: "/configuracion/cuentas" },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  return (
    <Card className="w-[20%] py-0">
      <CardContent className="p-2 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
