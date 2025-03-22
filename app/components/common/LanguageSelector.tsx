"use client";

import React, { useEffect, useState, useRef } from "react";
import StorageUtils from "@/app/utils/storage/StorageUtils";
import StorageConstants from "@/app/utils/storage/StorageConstants";
import { useLayout } from "@/app/LayoutContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLayout(); // Use context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load initial language only once
  useEffect(() => {
    const savedLanguage = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_LANGUAGE_CODE,
      false,
      "en"
    );
    if (savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
  }, [language, setLanguage]); // ✅ Run only once on mount

  const changeLanguage = (langCode: string) => {
    if (langCode !== language) {
      setLanguage(langCode);
      StorageUtils.save(StorageConstants.TEMPLATE_LANGUAGE_CODE, langCode, false);
      StorageUtils.save(StorageConstants.TEMPLATE_LANGUAGE_NAME, getLanguageName(langCode), false);
    }
    setIsDropdownOpen(false); // Close dropdown
  };

  const getLanguageName = (langCode: string): string => {
    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
    };
    return languageMap[langCode] || "Unknown";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex justify-between items-center w-32 px-3 py-2 text-sm font-medium bg-background-main-card text-foreground-main border-2 border-template-color-primary rounded-md cursor-pointer"
      >
        <span>{getLanguageName(language)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-foreground-main"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute mt-1 w-32 bg-background-main-card border border-border-medium shadow-lg z-50">
          <ul className="text-sm text-foreground-main">
            {[
              { code: "en", name: "English" },
              { code: "fr", name: "French" },
              { code: "es", name: "Spanish" },
              { code: "de", name: "German" },
              { code: "hi", name: "Hindi" },
              { code: "te", name: "Telugu" },
              { code: "ml", name: "Malayalam" },
            ].map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-background-main-card-hover ${language === lang.code ? "bg-background-main-card-selected" : ""
                    }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
