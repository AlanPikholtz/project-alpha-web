"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "../lib/utils";
import { useAccountId } from "../context/account-provider";

export default function AccountSelector({
  disable,
  onSelect,
  value,
}: {
  disable?: boolean;
  onSelect?: (id: number) => void;
  value?: number; // valor controlado
}) {
  const { accounts, loadingAccounts, selectedAccountId, setSelectedAccountId } =
    useAccountId();

  const [open, setOpen] = React.useState(false);

  // If we're uncontrolled (context), set first account by default
  React.useEffect(() => {
    if (onSelect) return; // Skip if controlled
    if (selectedAccountId || accounts.length === 0) return;
    setSelectedAccountId(accounts[0].id);
  }, [accounts, selectedAccountId, setSelectedAccountId, onSelect]);

  // Determine which ID to use
  const currentValue = onSelect ? value : selectedAccountId;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disable}>
        <Button
          className="min-w-[180px] justify-between"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          loading={loadingAccounts}
          asChild
        >
          {currentValue
            ? accounts.find((account) => account.id === currentValue)?.name
            : "Seleccionar cuenta..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cuenta..." className="h-9" />
          <CommandList>
            <CommandEmpty>Cuenta no encontrada.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={`${account.id}`}
                  onSelect={(idStr) => {
                    const id = +idStr;
                    if (onSelect) {
                      onSelect(id);
                    } else {
                      setSelectedAccountId(id);
                    }
                    setOpen(false);
                  }}
                >
                  {account.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedAccountId === account.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
