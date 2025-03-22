"use client";

import React, { useState, useRef, useEffect } from "react";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface ButtonDownloadProps {
  onDownloadPDF: () => void;
  onDownloadExcel: () => void;
  label?: string;
}

const ButtonDownload: React.FC<ButtonDownloadProps> = ({
  onDownloadPDF,
  onDownloadExcel,
  label,
}) => {
  const { t } = useTranslation();
  const download = t("buttons.download");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleDownloadPDF = () => {
    onDownloadPDF();
    setIsDropdownOpen(false); // Close dropdown after action
  };

  const handleDownloadExcel = () => {
    onDownloadExcel();
    setIsDropdownOpen(false); // Close dropdown after action
  };

  return (
    <div className="relative w-32" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="w-full px-4 py-2 bg-template-color-primary text-white rounded-md hover:bg-template-color-secondary transition"
      >
        {label || download}
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background-main shadow-lg rounded-md w-full z-10">
          <button
            onClick={handleDownloadPDF}
            className="block w-full px-4 py-2 text-left hover:bg-background-main-card"
          >
            {t("buttons.download_pdf")}
          </button>
          <button
            onClick={handleDownloadExcel}
            className="block w-full px-4 py-2 text-left hover:bg-background-main-card"
          >
            {t("buttons.download_excel")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonDownload;
