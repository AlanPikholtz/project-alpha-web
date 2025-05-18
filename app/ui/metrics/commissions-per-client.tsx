import { formatNumber } from "@/app/lib/helpers";
import type { CommissionsPerClient } from "@/app/lib/metrics/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export default function CommissionsPerClient({
  data,
}: {
  data?: CommissionsPerClient[];
}) {
  if (!data) return null;
  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle className="text-md font-normal">
          Comisiones por clientes.
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2">
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 z-10 bg-background">
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Comisión</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((x) => (
                <TableRow key={x.clientId}>
                  <TableCell>{x.clientFullName}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(x.totalCommissions, {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
