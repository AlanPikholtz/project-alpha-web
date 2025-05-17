"use client";

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
import React from "react";
import { useGetClientsQuery } from "../lib/clients/api";
import { Input } from "@/components/ui/input";

export default function ClientSelector({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const { data: clients, isLoading: loading } = useGetClientsQuery({
    limit: 0,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Input
          className="cursor-pointer w-full"
          placeholder={loading ? "Cargando..." : "Codigo de cliente"}
          value={clients?.data.find((x) => x.id === +value)?.code}
          disabled={loading}
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." className="h-9" />
          <CommandList>
            <CommandEmpty>Cliente no encontrado.</CommandEmpty>
            <CommandGroup>
              {clients?.data.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.id}`}
                  onSelect={(currentValue) => {
                    console.log({ currentValue });
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col gap-y-1">
                    {client.code}
                    <p className="text-slate-500 text-xs">
                      {client.firstName} {client.lastName}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
