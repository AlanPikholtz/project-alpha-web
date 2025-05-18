import { formatNumber } from "@/app/lib/helpers";
import type { ClientsPerAccount } from "@/app/lib/metrics/types";
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

export default function ClientsPerAccount({
  data,
}: {
  data?: ClientsPerAccount[];
}) {
  if (!data) return null;
  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle className="text-md font-normal">
          Clientes por cuenta
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2">
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 z-10 bg-background">
                <TableHead>Cuenta</TableHead>
                <TableHead className="text-right">Clientes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((x) => (
                <TableRow key={x.accountId}>
                  <TableCell>{x.accountName}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(x.totalClients)}
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

// <Card className="w-100 h-100">
//   <CardHeader>
//     <CardTitle>Clientes por cuenta</CardTitle>
//   </CardHeader>
//   <CardContent>
//     {data?.length === 0 && <p>No se encontron datos</p>}
//     {data?.map((x) => (
//       <div key={x.accountId} className="flex items-center ">
//         <p className="flex-1">{x.accountName}</p>
//         <p>{x.totalClients}</p>
//       </div>
//     ))}
//   </CardContent>
// </Card>
