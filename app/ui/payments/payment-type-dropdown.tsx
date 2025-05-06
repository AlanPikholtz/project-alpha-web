import * as React from "react";
import { Check } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/app/lib/utils";

const PAYMENT_TYPES = [
  { value: "cash", label: "Efectivo" },
  { value: "wire", label: "Transferencia" },
  { value: "card", label: "Tarjeta" },
];

export default function PaymentTypeDropdown({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Input
          className="cursor-pointer w-full"
          placeholder="Tipo"
          value={PAYMENT_TYPES.find((x) => x.value === value)?.label}
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {PAYMENT_TYPES.map((type) => (
                <CommandItem
                  key={type.value}
                  value={`${type.value}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  {type.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === type.value ? "opacity-100" : "opacity-0"
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
