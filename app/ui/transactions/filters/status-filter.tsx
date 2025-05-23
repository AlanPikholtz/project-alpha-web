import { assignedOptions } from "@/app/lib/transactions/data";
import { TransactionStatus } from "@/app/lib/transactions/types";
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
import React from "react";

export default function StatusFilter({
  status,
  setStatus,
}: {
  status?: TransactionStatus;
  setStatus: (value: TransactionStatus) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="min-w-[180px] justify-between"
          variant="outline"
          role="combobox"
          asChild
        >
          {assignedOptions.find((o) => o.value === status)?.label ?? "Todos"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {assignedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => setStatus(option.value as TransactionStatus)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      status === option.value ? "opacity-100" : "opacity-0"
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
