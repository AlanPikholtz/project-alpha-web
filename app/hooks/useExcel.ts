import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function useExcel() {
  const exportToExcel = (
    sheets: { name: string; data: unknown[] }[],
    fileName: string
  ) => {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ name, data }) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `${fileName}.xlsx`);
  };

  return { exportToExcel };
}
