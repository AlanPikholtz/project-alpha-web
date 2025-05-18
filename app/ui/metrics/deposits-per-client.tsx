import { formatNumber } from "@/app/lib/helpers";
import type { DepositsPerClient } from "@/app/lib/metrics/types";
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

export default function DepositsPerClient({
  data,
}: {
  data?: DepositsPerClient[];
}) {
  if (!data) return null;
  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle className="text-md font-normal">
          Depositos por clientes
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2">
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 z-10 bg-background">
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Depositos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((x) => (
                <TableRow key={x.clientId}>
                  <TableCell>{x.clientFullName}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(x.totalDeposits, {
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

// return (
//   <Card className="w-100 h-100">
//     <CardHeader>
//       <CardTitle>Depositos por cliente</CardTitle>
//     </CardHeader>
//     <CardContent>
//       {data?.length === 0 && <p>No se encontron datos</p>}
//       {data?.map((x) => (
//         <div key={x.clientId} className="flex items-center ">
//           <p className="flex-1">{x.clientFullName}</p>
//           <p>{x.totalDeposits}</p>
//         </div>
//       ))}
//     </CardContent>
//   </Card>
// );
