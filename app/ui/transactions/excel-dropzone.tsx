import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Transaction } from "../../lib/transactions/types";

export default function ExcelDropzone({
  onFileRead,
}: {
  onFileRead: (data: Partial<Transaction>[]) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[32];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<
          string,
          unknown
        >[]; // Convert to JSON

        // Convert to typed array
        const typedData: Partial<Transaction>[] = jsonData.map((row) => {
          return {
            createdAt: String(row["Fecha"]), // Adjust key names based on your Excel headers
            amount: Number(row["Monto"]),
          };
        });

        onFileRead(typedData); // Pass data to parent component
      };
      reader.readAsArrayBuffer(file);
    },
    [onFileRead]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xls",
        ".xlsx",
      ],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 flex h-full w-full items-center justify-center border-dashed p-6 rounded-lg cursor-pointer text-center bg-gray-100 hover:bg-gray-200"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop it here...</p>
      ) : (
        <p>Drag & drop an Excel file here, or click to select one</p>
      )}
    </div>
  );
}
