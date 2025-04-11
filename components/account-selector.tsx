"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { useGetAccountsQuery } from "@/lib/accounts/api";

export default function AccountSelector() {
  const { data: accounts } = useGetAccountsQuery({});
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? accounts?.data.find((account) => `${account.id}` === value)?.name
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
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  {account.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === `${account.id}` ? "opacity-100" : "opacity-0"
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
