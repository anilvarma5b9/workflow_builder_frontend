"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaList } from "react-icons/fa";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface PaginationControlProps {
  pageCount: number; // Items per page
  pageIndex: number; // Current page index
  totalRecords: number; // Total number of records
  onPageChange: (pageIndex: number) => void; // Callback for changing the page
  onPageSizeChange: (pageCount: number) => void; // Callback for changing items per page
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  pageCount,
  pageIndex,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}) => {

  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      onPageChange(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if ((pageIndex + 1) * pageCount < totalRecords) {
      onPageChange(pageIndex + 1);
    }
  };

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

  return (
    <div className="flex items-center px-4 py-2 space-x-3 relative">
      {/* Items per page */}
      <div className="relative w-64" ref={dropdownRef}>
        {/* Button to Open Dropdown */}
        <div
          className={`relative w-full border px-3 py-2.5 text-sm rounded-md transition duration-150 ease-in-out shadow-sm cursor-pointer flex items-center justify-between
            ${isDropdownOpen ? "border-template-color-primary" : "border-medium"}
            bg-background-main text-foreground-main hover:border-template-color-primary`}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >

          <div className="flex items-center space-x-2">
            <FaList className="text-template-color-primary" />
            <span className="truncate">{t("buttons.items_per_page")} {pageCount}</span>
          </div>
          {isDropdownOpen ? (
            <FaChevronUp className="text-template-color-primary ml-2 transition-transform duration-200" />
          ) : (
            <FaChevronDown className="text-template-color-primary ml-2 transition-transform duration-200" />
          )}
        </div>

        {/* Dropdown List - Opens Above the Button & Shows All Items */}
        {isDropdownOpen && (
          <ul className="absolute bottom-full left-0 w-full bg-background-main border border-medium shadow-lg z-50 rounded-md mb-2">
            {[10, 25, 50, 100, 200, 300, 400, 500, 1000].map((count) => (
              <li
                key={count}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-background-main-card text-foreground-main ${pageCount === count ? "text-template-color-primary font-semibold" : ""
                  }`}
                onClick={() => {
                  onPageSizeChange(count);
                  setIsDropdownOpen(false);
                }}
              >
                {count}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Previous Button */}
      <button
        onClick={handlePreviousPage}
        disabled={pageIndex === 0}
        className="p-2 rounded-full text-sm text-foreground-main bg-background-main hover:bg-template-color-primary disabled:opacity-50 flex items-center justify-center w-8 h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page range */}
      <div className="text-sm text-center text-foreground-main w-32">
        {totalRecords > 0 ? (
          <>
            {pageIndex * pageCount + 1}–
            {Math.min((pageIndex + 1) * pageCount, totalRecords)} of {totalRecords}
          </>
        ) : (
          "0–0 of 0"
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNextPage}
        disabled={(pageIndex + 1) * pageCount >= totalRecords}
        className="p-2 rounded-full text-sm text-foreground-main bg-background-main hover:bg-template-color-primary disabled:opacity-50 flex items-center justify-center w-8 h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default PaginationControl;
