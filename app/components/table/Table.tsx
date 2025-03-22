"use client";

import React from "react";

import {
  OrderBy,
} from "@/api/Enums";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

// 🔹 Sorting Order Interface
export interface SortOrder {
  name: string;
  l_name?: string;
  field: string;
  direction: OrderBy;
}

export interface ColumnDefinition<T> {
  name: string;
  l_name?: string;
  key?: keyof T | string;
  combineKeys?: string[];
  combineFormatter?: (values: unknown[]) => React.ReactNode;
  type: "Simple" | "Custom" | "Combined";
  accessor?: (row: T) => React.ReactNode;
  hidden?: boolean;
  sortable?: boolean;
  field?: string;
}

interface TableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  showIndexColumn?: boolean;
  loading?: boolean;
  noRecordsMessage?: string;
  sortOrder: SortOrder[];
  onSortChange: (orderBy: SortOrder[]) => void;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  actions,
  showIndexColumn = false,
  loading = false,
  noRecordsMessage,
  sortOrder,
  onSortChange,
}: TableProps<T>) => {

  const { t } = useTranslation();

  // 🔹 Handle Sorting Click (Maintains Sorting Order)
  const handleSort = (column: ColumnDefinition<T>) => {
    if (!column.sortable) return;

    const existingSortIndex = sortOrder.findIndex((sort) => sort.name === column.name);
    let newOrder: SortOrder[];

    if (existingSortIndex !== -1) {
      // ✅ If already sorted, toggle direction or remove sorting
      const existingSort = sortOrder[existingSortIndex];
      if (existingSort.direction === "asc") {
        newOrder = [...sortOrder];
        newOrder[existingSortIndex] = { name: column.name, l_name: column.l_name, field: column.field as string, direction: OrderBy.desc };
      } else {
        newOrder = sortOrder.filter((sort) => sort.name !== column.name); // ❌ Remove sorting if "desc"
      }
    } else {
      // ✅ If new sort, add to the end (maintain order)
      newOrder = [...sortOrder, { name: column.name, l_name: column.l_name, field: column.field as string, direction: OrderBy.asc }];
    }

    onSortChange(newOrder);
  };

  // 🔹 Sorting Icons with Order Priority Badge on Icon
  const getSortIcon = (column: ColumnDefinition<T>) => {
    const sortIndex = sortOrder.findIndex((s) => s.name === column.name);
    if (sortIndex === -1) return null; // No sorting applied

    const sortDirection = sortOrder[sortIndex].direction;

    return (
      <span className="relative flex items-center ml-2">
        {/* Sorting Icon */}
        <span className="text-lg font-bold">
          {sortDirection === "asc" ? "🔼" : "🔽"}
        </span>

        {/* Order Badge on Icon */}
        <span className="absolute -top-2 -right-3 bg-template-color-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {sortIndex + 1}
        </span>
      </span>
    );
  };

  // 🔹 Ensure Safe Rendering
  const renderCell = (row: T, column: ColumnDefinition<T>): React.ReactNode => {
    if (column.type === "Custom" && column.accessor) {
      return column.accessor(row);
    }

    if (column.type === "Combined" && column.combineKeys) {
      const values = column.combineKeys.map((key) => {
        const keys = String(key).split("?.");
        let value: unknown = row;
        for (const subKey of keys) {
          value = (value as Record<string, unknown>)?.[subKey];
          if (value === undefined) break;
        }
        return value ?? "—";
      });
      return column.combineFormatter ? column.combineFormatter(values) : values.join(" - ");
    }

    const keys = String(column.key).split("?.");
    let value: unknown = row;
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
      if (value === undefined) break;
    }

    return (value ?? "—") as React.ReactNode; // ✅ Explicit Cast
  };

  return (
    <div className="overflow-auto h-full">
      <table className="min-w-full table-auto bg-background-main border-collapse">
        <thead className="sticky top-0 bg-background-main-card-selected z-10">
          <tr>
            {showIndexColumn && <th className="px-4 py-3 text-left font-bold border text-template-color-primary">{t("table.id")}</th>}
            {actions && <th className="px-4 py-3 text-left font-bold border text-template-color-primary">{t("table.actions")}</th>}
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left font-bold border cursor-pointer ${column.sortable ? "hover:bg-background-main-card-hover" : ""
                  }`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center text-template-color-primary ">
                  {column.l_name}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0) + (showIndexColumn ? 1 : 0)} className="text-center p-8">
                {loading ? t("messages.table_loading") : (noRecordsMessage || t("messages.no_records"))}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-background-secondary-card-hover transition">
                {showIndexColumn && <td className="px-4 py-2 border">{rowIndex + 1}</td>}
                {actions && <td className="px-4 py-2 border">{actions(row)}</td>}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 border">{renderCell(row, column)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
