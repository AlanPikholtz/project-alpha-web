import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
        <CardTitle className="text-md font-normal flex-1">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <Label className="font-semibold text-2xl">{value}</Label>
      </CardContent>
    </Card>
  );
}
