import { assignedOptions } from "@/app/lib/transactions/data";
import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
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
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

export default function StatusFilter({
  assignedFilter,
  setAssignedFilter,
}: {
  assignedFilter: string;
  setAssignedFilter: (value: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          {assignedOptions.find((o) => o.value === assignedFilter)?.label ??
            "Asignado"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Filtrar..." />
          <CommandList>
            <CommandGroup>
              {assignedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => setAssignedFilter(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      assignedFilter === option.value
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
