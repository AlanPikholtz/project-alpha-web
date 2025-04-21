import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

export default function DateRangeFilter({
  dateRange,
  setDateRange,
}: {
  dateRange?: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[260px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                {format(dateRange.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Seleccionar rango</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={dateRange}
          numberOfMonths={2}
          defaultMonth={dateRange?.from}
          locale={es}
          onSelect={setDateRange}
        />
        <div className="flex justify-end p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDateRange(undefined)}
          >
            Borrar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
