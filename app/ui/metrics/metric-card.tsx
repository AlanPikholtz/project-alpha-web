import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { ReactNode } from "react";

export default function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value?: string | number;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex-1 h-full hover:shadow-lg">
      <CardHeader className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-md font-normal flex-1 truncate overflow-hidden whitespace-nowrap cursor-default">
                {title}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {icon}
      </CardHeader>
      <CardContent>
        <Label className="font-semibold text-2xl">{value}</Label>
      </CardContent>
    </Card>
  );
}
