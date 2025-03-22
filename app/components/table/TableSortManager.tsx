"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaGripVertical, FaChevronDown, FaChevronUp, FaTimes, FaSort } from "react-icons/fa";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortOrder } from "@/app/components/table/Table";
import {
    OrderBy,
} from "@/api/Enums";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface TableSortManagerProps {
    sortOrder: SortOrder[];
    onChange: (updatedSortOrder: SortOrder[]) => void;
}

const TableSortManager: React.FC<TableSortManagerProps> = ({ sortOrder, onChange }) => {

    const { t } = useTranslation();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortList, setSortList] = useState<SortOrder[]>(sortOrder);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync local state with parent state
    useEffect(() => {
        setSortList(sortOrder);
    }, [sortOrder]);

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

    // ✅ Toggle Sorting Direction
    const toggleSortDirection = useCallback((name: string) => {
        setSortList((prevSort) =>
            prevSort.map((sort) =>
                sort.name === name ? { ...sort, direction: sort.direction === OrderBy.asc ? OrderBy.desc : OrderBy.asc } : sort
            )
        );
    }, []);

    // ✅ Remove a Sorting Field
    const removeSortField = useCallback((name: string) => {
        setSortList((prevSort) => prevSort.filter((sort) => sort.name !== name));
    }, []);

    // ✅ Handle Drag-and-Drop Sorting
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sortList.findIndex((sort) => sort.name === active.id);
        const newIndex = sortList.findIndex((sort) => sort.name === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newSortList = [...sortList];
            const [movedItem] = newSortList.splice(oldIndex, 1);
            newSortList.splice(newIndex, 0, movedItem);
            setSortList(newSortList);
        }
    };

    // ✅ Apply Sort Changes
    useEffect(() => {
        onChange(sortList);
    }, [sortList, onChange]);

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
                    <FaSort className="text-template-color-primary" />
                    <span>{t("buttons.sort_order")}</span>
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
                    {/* Sort List with Drag & Drop */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sortList.map((sort) => sort.name)} strategy={verticalListSortingStrategy}>
                            <ul className="space-y-2">
                                {sortList.map((sort, index) => (
                                    <SortableSortItem
                                        key={sort.name}
                                        sort={sort}
                                        index={index}
                                        toggleSortDirection={toggleSortDirection}
                                        removeSortField={removeSortField}
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};

// ✅ Sortable List Item
const SortableSortItem: React.FC<{
    sort: SortOrder;
    index: number;
    toggleSortDirection: (name: string) => void;
    removeSortField: (name: string) => void;
}> = ({ sort, index, toggleSortDirection, removeSortField }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sort.name });

    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className="flex items-center space-x-2 p-3 border border-medium rounded-md bg-background-main"
        >
            {/* Drag Handle */}
            <span {...attributes} {...listeners} className="cursor-grab text-gray-500">
                <FaGripVertical />
            </span>

            {/* Sort Field Name */}
            <span className="text-sm text-foreground-main flex-grow">{sort.l_name}</span>

            {/* Sort Icon with Order Badge */}
            <button onClick={() => toggleSortDirection(sort.name)} className="relative flex items-center text-lg text-template-color-primary mx-1">
                {sort.direction === "asc" ? "🔼" : "🔽"}

                {/* Order Badge */}
                <span className="absolute -top-2 -right-3 bg-template-color-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {index + 1}
                </span>
            </button>

            {/* Remove Sort */}
            <button onClick={() => removeSortField(sort.name)} className="text-red-500 hover:text-red-700">
                <FaTimes />
            </button>
        </li>
    );
};

export default TableSortManager;
