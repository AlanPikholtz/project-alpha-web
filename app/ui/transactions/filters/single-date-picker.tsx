import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopoverTrigger } from "@radix-ui/react-popover";
import clsx from "clsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import _ from "lodash";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";

export default function SingleDatePicker({
  className,
  date,
  monthOnly,
  withDeleteButton = true,
  setDate,
}: {
  className?: string;
  date?: Date;
  monthOnly?: boolean;
  withDeleteButton?: boolean;
  setDate: (date: Date | undefined) => void;
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={clsx(
            "w-[260px] justify-start text-left font-normal",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            _.capitalize(
              format(date, monthOnly ? "MMMM yyyy" : "dd/MM/yyyy", {
                locale: es,
              })
            )
          ) : (
            <span>Seleccionar fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {monthOnly ? (
          <div className="space-y-4 p-4">
            <Select
              value={selectedYear.toString()}
              onValueChange={(year) => setSelectedYear(Number(year))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-3 gap-2">
              {months.map((monthName, index) => (
                <Button
                  key={monthName}
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const selectedMonth = new Date();
                    selectedMonth.setFullYear(selectedYear);
                    selectedMonth.setMonth(index);
                    selectedMonth.setDate(1);
                    setDate(selectedMonth);
                  }}
                >
                  {monthName}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            numberOfMonths={2}
            defaultMonth={date}
            locale={es}
            onSelect={setDate}
          />
        )}
        {withDeleteButton && (
          <div className="flex justify-end p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDate(undefined)}
            >
              Borrar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
