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
import React, { useMemo } from "react";
import { useGetClientsQuery } from "../lib/clients/api";
import { Input } from "@/components/ui/input";
import { useAccountId } from "../context/account-provider";

export default function ClientSelector({
  value,
  allClients = false,
  setValue,
}: {
  value: string;
  allClients?: boolean;
  setValue: (value: string) => void;
}) {
  const { selectedAccountId } = useAccountId();

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const { data: clients, isLoading: loading } = useGetClientsQuery(
    {
      accountId: !allClients ? selectedAccountId : undefined,
      limit: 0,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      skip: !allClients && !selectedAccountId,
    }
  );

  const filteredClients = useMemo(
    () =>
      clients?.data.filter((client) => {
        const searchLower = searchValue.toLowerCase();
        return (
          client.code.toLowerCase().includes(searchLower) ||
          client.firstName.toLowerCase().includes(searchLower) ||
          client.lastName.toLowerCase().includes(searchLower)
        );
      }),
    [clients?.data, searchValue]
  );

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
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Buscar cliente..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>Cliente no encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredClients?.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.code} ${client.firstName} ${client.lastName}`}
                  onSelect={() => {
                    setValue(client.id.toString());
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
