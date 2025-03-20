import { useGetClientsQuery } from "@/app/lib/clients/api";
import { Transaction } from "@/app/lib/transactions/types";
import React, { useState } from "react";

export default function AssignTransactionsTable() {
  const { data: clients } = useGetClientsQuery();

  const [tableData, setTableData] = useState<Partial<Transaction>[]>([]);
  const [amountFilter, setAmountFilter] = useState("");

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default pasting behavior
    const text: string = e.clipboardData.getData("text");

    const rows = text
      .split("\n")
      .map((row) => row.split("\t").map((cell) => cell.trim()));

    console.log({ rows });

    const parsedTransactions: Partial<Transaction>[] = rows.map((row) => ({
      createdAt: row[0], // Keep as string
      type: row[1],
      amount: parseFloat(row[2]), // Ensure correct number format
    }));

    setTableData(parsedTransactions);
  };

  return (
    <div className="flex flex-col border rounded h-full border-black/10">
      {tableData.length === 0 ? (
        <textarea
          className="h-full"
          placeholder="Pegue las transacciones (maximo 100)"
          onPaste={handlePaste}
        />
      ) : (
        <div className="flex flex-col gap-y-4">
          <div>
            <p>Filtros</p>
            <input
              placeholder="Monto"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
            />
          </div>
          <table className="w-full" border={1}>
            <tbody>
              <tr>
                <td>Fecha</td>
                <td>Tipo</td>
                <td>Monto</td>
                <td>Cliente</td>
              </tr>
              {tableData
                .filter((x) => x.amount?.toString().includes(amountFilter))
                .map((row, i) => (
                  <tr key={i}>
                    <td>{row.createdAt}</td>
                    <td>{row.type}</td>
                    <td>{row.amount}</td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
