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

export default function AccountSelector({ disable }: { disable?: boolean }) {
  const { accounts, loadingAccounts, selectedAccountId, setSelectedAccountId } =
    useAccountId();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedAccountId || accounts.length === 0) return;
    setSelectedAccountId(accounts[0].id);
  }, [accounts, selectedAccountId, setSelectedAccountId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disable}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          loading={loadingAccounts}
        >
          {selectedAccountId
            ? accounts.find((account) => account.id === selectedAccountId)?.name
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
                  onSelect={(currentValue) => {
                    console.log({ currentValue });

                    setSelectedAccountId(+currentValue);
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
