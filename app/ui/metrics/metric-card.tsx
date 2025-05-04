import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function MetricCard({
  title,
  value,
}: {
  title: string;
  value?: string | number;
}) {
  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <label>{value}</label>
      </CardContent>
    </Card>
  );
}
