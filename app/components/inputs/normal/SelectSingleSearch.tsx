'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { SelectOption } from '@/app/components/inputs/input_types';

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface SelectSingleProps {
  label?: string;
  placeholder?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}

const SelectSingleSearch: React.FC<SelectSingleProps> = ({
  label,
  placeholder = label,
  error,
  options,
  value,
  onChange,
}) => {

  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find((option) => option.key === value) || null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handles option selection
  const handleOptionChange = useCallback((option: SelectOption) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    onChange?.(option.key);
  }, [onChange]);

  // Handles outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Updates selected option when `value` changes externally
  useEffect(() => {
    setSelectedOption(options.find((option) => option.key === value) || null);
  }, [value, options]);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-1 relative" ref={dropdownRef}>
      {/* Label */}
      {label && <label className="block mb-1 text-sm font-semibold text-foreground-main">{label}</label>}

      {/* Dropdown Selector */}
      <div
        className={`relative w-full border pl-2.5 pr-5 py-2.5 text-sm rounded-md transition duration-150 ease-in-out shadow-sm 
                  ${error ? 'border-red-500' : 'border-medium hover:border-template-color-primary focus-within:border-template-color-primary'}
          bg-background-main text-foreground-main cursor-pointer`}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isDropdownOpen ? (
          <FaChevronUp className="absolute right-2 top-1/2 transform -translate-y-1/2 text-template-color-primary" />
        ) : (
          <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-template-color-primary" />
        )}
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full bg-background-main border border-medium shadow-lg z-10">

          {/* Search Input */}
          <input
            type="text"
            placeholder={t("forms.search_placeholder")}
            className="w-full px-2.5 py-2.5 bg-background-main text-sm border-b border-medium focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t("forms.search_options")}
          />

          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.key}
                  onClick={() => handleOptionChange(option)}
                  className="cursor-pointer px-2.5 py-2.5 hover:bg-background-main-card flex justify-between"
                >
                  <span
                    className={`${option.key === selectedOption?.key
                      ? 'text-template-color-primary font-semibold'
                      : 'text-foreground-main'
                      }`}
                  >
                    {option.label}
                  </span>
                  {selectedOption?.key === option.key && <FaCheck className="w-4 h-4 ml-auto text-template-color-primary" />}
                </li>
              ))
            ) : (
              <li className="px-2.5 py-2.5 text-sm text-gray-500 text-center" aria-live="polite">{t("messages.no_options")}</li>
            )}
          </ul>
          
        </div>
      )}

      {/* Error Message */}
      <div className="mt-1 h-1 text-sm">
        {error && <p className="text-red-500">{error}</p>}
      </div>

    </div>
  );
};

export default SelectSingleSearch;
