import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";

export default function SingleDatePicker({
  date,
  setDate,
}: {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[260px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="single"
          selected={date}
          numberOfMonths={2}
          defaultMonth={date}
          locale={es}
          onSelect={setDate}
        />
        <div className="flex justify-end p-2 border-t">
          <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>
            Borrar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
