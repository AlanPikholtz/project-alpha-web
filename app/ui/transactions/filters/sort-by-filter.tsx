import { sortByOptions } from "@/app/lib/transactions/data";
import { SortBy } from "@/app/lib/transactions/types";
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

export default function SortByFilter({
  sortByFilter,
  setSortByFilter,
}: {
  sortByFilter?: SortBy;
  setSortByFilter: (value: SortBy) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="min-w-[180px] justify-between"
          variant="outline"
          role="combobox"
          asChild
        >
          Ordenar Por
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {sortByOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    setSortByFilter(option.value as SortBy);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      sortByFilter === option.value
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
