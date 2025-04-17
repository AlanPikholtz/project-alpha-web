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
import { useGetAccountsQuery } from "../lib/accounts/api";
import { cn } from "../lib/utils";
import { useAccountId } from "../context/account-provider";

export default function AccountSelector() {
  const { selectedAccountId, setSelectedAccountId } = useAccountId();

  const { data: accounts } = useGetAccountsQuery({});
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedAccountId
            ? accounts?.data.find((account) => account.id === selectedAccountId)
                ?.name
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
              {accounts?.data.map((account) => (
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
