import { typeOptions } from "@/app/lib/transactions/data";
import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";

export default function TypeFilter({
  type,
  setType,
}: {
  type?: "transactions" | "payments" | "all";
  setType: (value: "transactions" | "payments" | "all") => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="min-w-[180px] justify-between"
          variant="outline"
          role="combobox"
          asChild
        >
          {typeOptions.find((o) => o.value === type)?.label ?? "Todos"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {typeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    setType(
                      option.value as "transactions" | "payments" | "all"
                    );
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      type === option.value ? "opacity-100" : "opacity-0"
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
