import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type SheetDefinition = {
  name: string;
  data: unknown[];
  columns?: { wch: number }[];
};

export default function useExcel() {
  const exportToExcel = (sheets: SheetDefinition[], fileName: string) => {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ name, data, columns }) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      // Sizes for headers
      if (columns) {
        worksheet["!cols"] = columns;
      }
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    // Excel does not allow file names over 31 chars
    const truncatedFileName = fileName.slice(0, 31);
    saveAs(blob, `${truncatedFileName}.xlsx`);
  };

  return { exportToExcel };
}
