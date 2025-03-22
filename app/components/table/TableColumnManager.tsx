"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaGripVertical, FaSync, FaColumns, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StorageUtils from "@/app/utils/storage/StorageUtils";
import { ColumnDefinition } from "@/app/components/table/Table";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface TableColumnManagerProps<T> {
  columns: ColumnDefinition<T>[];
  tableStorageKey: string;
  onChange: (updatedColumns: ColumnDefinition<T>[]) => void;
}

const TableColumnManager = <T,>({
  columns,
  tableStorageKey,
  onChange,
}: TableColumnManagerProps<T>) => {

  const { t } = useTranslation();

  const LOCAL_STORAGE_KEY = `table_columns_${tableStorageKey}`.toLowerCase().replace(/\s+/g, '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [columnList, setColumnList] = useState<ColumnDefinition<T>[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  // ✅ Compute selection state
  const allSelected = columnList.every((col) => !col.hidden);
  const someSelected = columnList.some((col) => !col.hidden) && !allSelected;

  // ✅ Load Column Order & Visibility from Local Storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedColumns = StorageUtils.load<{ name: string; hidden?: boolean }[]>(LOCAL_STORAGE_KEY, false, []);

    if (storedColumns.length) {
      const storedNames = new Set(storedColumns.map((col) => col.name));

      const mergedColumns = [
        ...storedColumns.map(({ name, hidden }) => {
          const col = columns.find((c) => c.name === name);
          return col ? { ...col, hidden } : null;
        }).filter(Boolean) as ColumnDefinition<T>[],
        ...columns.filter((col) => !storedNames.has(col.name)),
      ];

      setColumnList((prev) => (JSON.stringify(prev) !== JSON.stringify(mergedColumns) ? mergedColumns : prev));
    } else {
      setColumnList(columns);
    }
  }, []); // ✅ No dependency on `columns`

  useEffect(() => {
    setColumnList((prevColumns) => {
      const updatedColumns = prevColumns.map((col) => ({
        ...col,
        l_name: columns.find((c) => c.name === col.name)?.l_name || col.name,
      }));

      // ✅ Only update state if columns are different
      if (JSON.stringify(prevColumns) !== JSON.stringify(updatedColumns)) {
        return updatedColumns;
      }
      return prevColumns; // 🔹 Prevents unnecessary re-renders
    });
  }, [columns]); // ✅ Runs only when `columns` change

  // ✅ Save Column Order & Visibility to Local Storage
  useEffect(() => {
    const columnSettings = columnList.map((col) => ({
      name: col.name,
      hidden: col.hidden,
    }));
    StorageUtils.save(LOCAL_STORAGE_KEY, columnSettings);
    onChange(columnList);
  }, [columnList]); // ✅ No infinite loop (removed unnecessary dependencies)

  // ✅ Update `indeterminate` state for "Select All"
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // ✅ Toggle Column Visibility
  const toggleColumnVisibility = useCallback((name: string) => {
    setColumnList((prevColumns) =>
      prevColumns.map((col) =>
        col.name === name ? { ...col, hidden: !col.hidden } : col
      )
    );
  }, []);

  // ✅ Toggle Select All
  const toggleSelectAll = () => {
    setColumnList((prevColumns) =>
      prevColumns.map((col) => ({ ...col, hidden: allSelected }))
    );
  };

  // ✅ Reset Columns to Default Order
  const resetColumns = () => {
    setColumnList(columns);
  };

  // ✅ Handle Drag-and-Drop Sorting
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnList.findIndex((col) => col.name === active.id);
    const newIndex = columnList.findIndex((col) => col.name === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newColumns = [...columnList];
      const [movedItem] = newColumns.splice(oldIndex, 1);
      newColumns.splice(newIndex, 0, movedItem);
      setColumnList(newColumns);
    }
  };

  return (
    <div className="relative w-[300px]" ref={dropdownRef}>
      {/* Button to Open Dropdown */}
      <div
        className={`relative w-full border px-4 py-3 text-sm rounded-md transition duration-150 ease-in-out shadow-sm cursor-pointer flex items-center justify-between
          ${isDropdownOpen ? "border-template-color-primary" : "border-medium"}
          bg-background-main text-foreground-main hover:border-template-color-primary`}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isDropdownOpen}
      >
        <div className="flex items-center space-x-2">
          <FaColumns className="text-template-color-primary" />
          <span>{t("buttons.manage_columns")}</span>
        </div>
        {isDropdownOpen ? (
          <FaChevronUp className="text-template-color-primary ml-2 transition-transform duration-200" />
        ) : (
          <FaChevronDown className="text-template-color-primary ml-2 transition-transform duration-200" />
        )}
      </div>

      {/* Dropdown List - Opens Above the Button */}
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 w-[300px] bg-background-main border border-medium shadow-lg z-50 rounded-md mb-2 p-4 max-h-[75vh] overflow-auto">

          {/* Select All Checkbox + Reset Button */}
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center space-x-2 cursor-pointer accent-template-color-primary">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="cursor-pointer"
              />
              <span className="text-sm text-foreground-main font-semibold">{t("buttons.select_all")}</span>
            </label>
            <button
              onClick={resetColumns}
              className="text-sm font-semibold text-template-color-primary flex items-center space-x-1 hover:underline"
            >
              <FaSync className="text-template-color-primary" />
              <span>{t("buttons.reset")}</span>
            </button>
          </div>

          {/* Column List with Drag & Drop */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columnList.map((col) => col.name)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {columnList.map((column) => (
                  <SortableColumnItem key={column.name} column={column} toggleColumnVisibility={toggleColumnVisibility} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default TableColumnManager;

// ✅ Updated SortableColumnItem
const SortableColumnItem = <T,>({
  column,
  toggleColumnVisibility,
}: {
  column: ColumnDefinition<T>;
  toggleColumnVisibility: (name: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.name });

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="flex items-center space-x-2 p-3 border border-medium rounded-md bg-background-main">
      <span {...attributes} {...listeners} className="cursor-grab text-gray-500">
        <FaGripVertical />
      </span>
      <label className="flex items-center space-x-2 cursor-pointer w-full accent-template-color-primary">
        <input type="checkbox" checked={!column.hidden} onChange={() => toggleColumnVisibility(column.name)} className="cursor-pointer" />
        <span className="text-sm text-foreground-main w-full">{column.l_name}</span>
      </label>
    </li>
  );
};
