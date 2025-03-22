import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ColumnDefinition } from '@/app/components/table/Table';

const sanitizeFileName = (fileName: string): string => fileName.replace(/\s+/g, '_');

const extractValue = (row: Record<string, unknown>, key: string): string | number | boolean | null => {
  const keys = key.split('?.');
  let value: unknown = row;
  for (const subKey of keys) {
    value = (value as Record<string, unknown>)?.[subKey];
    if (value === undefined) break;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return '—';
};

export const downloadPDF = <T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnDefinition<T>[],
  fileName: string,
  id_needed = true
): void => {
  const doc = new jsPDF();
  doc.text(fileName, 10, 10);

  // Extract column headers
  const headers = id_needed ? ['ID', ...columns.map((col) => col.name)] : columns.map((col) => col.name);

  // Process rows
  const rows: (string | number | boolean | null)[][] = data.map((row, index) => {
    const rowData = columns.map((col) => {
      if (col.type === 'Combined' && col.combineKeys) {
        const values = col.combineKeys.map((key) => extractValue(row, key));
        return String(col.combineFormatter ? col.combineFormatter(values) : values.join(' - '));
      }
      return extractValue(row, String(col.key));
    });
    return id_needed ? [index + 1, ...rowData] : rowData;
  });

  // Generate PDF
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
  });

  // Save the PDF
  doc.save(`${sanitizeFileName(fileName)}.pdf`);
};

export const downloadExcel = <T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnDefinition<T>[],
  fileName: string,
  id_needed = true 
): void => {
  // Process rows
  const rows = data.map((row, index) =>
    columns.reduce((acc, col) => {
      if (col.type === 'Combined' && col.combineKeys) {
        const values = col.combineKeys.map((key) => extractValue(row, key));
        acc[col.name] = col.combineFormatter
          ? col.combineFormatter(values)
          : values.join(' - ');
      } else {
        acc[col.name] = extractValue(row, String(col.key));
      }
      return acc;
    }, id_needed ? { ID: index + 1 } : {} as Record<string, unknown>)
  );

  // Generate Excel worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${sanitizeFileName(fileName)}.xlsx`);
};
