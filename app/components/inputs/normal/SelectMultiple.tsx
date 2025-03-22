'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SelectOption } from '@/app/components/inputs/input_types';

// Language
import { useTranslation } from "@/app/utils/language/i18n"; 

interface SelectMultipleProps {
  label?: string;
  placeholder?: string;
  error?: string;
  options: SelectOption[];
  value?: Array<string>;
  onChange?: (values: Array<string>) => void;
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({
  label,
  placeholder = label,
  error,
  options,
  value = [],
  onChange,
}) => {

  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(
    options.filter((option) => value.includes(option.key))
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionToggle = useCallback(
    (option: SelectOption) => {
      setSelectedOptions((prevSelected) => {
        const isSelected = prevSelected.some((selected) => selected.key === option.key);
        const updatedOptions = isSelected
          ? prevSelected.filter((selected) => selected.key !== option.key)
          : [...prevSelected, option];

        onChange?.(updatedOptions.map((opt) => opt.key));
        return updatedOptions;
      });
    },
    [onChange]
  );

  const handleSelectAllToggle = useCallback(
    (selectAll: boolean) => {
      const updatedOptions = selectAll ? options : [];
      setSelectedOptions(updatedOptions);
      onChange?.(updatedOptions.map((opt) => opt.key));
    },
    [options, onChange]
  );

  useEffect(() => {
    setSelectedOptions(options.filter((option) => value.includes(option.key)));
  }, [value, options]);

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

  const displaySelected = () => selectedOptions.map((opt) => opt.label).join(', ') || placeholder;

  const isAllSelected = selectedOptions.length === options.length;

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
        <span className="truncate block whitespace-nowrap overflow-hidden text-ellipsis" title={displaySelected()}>
          {selectedOptions.length > 0 ? displaySelected() : placeholder}
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
          {/* Select All Option */}
          {options.length > 0 && (
            <div className="px-2 py-2 border-b border-medium">
              <label className="flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAllToggle(e.target.checked)}
                  className="mr-2 accent-template-color-primary cursor-pointer"
                  aria-label={t("buttons.select_all")}
                />
                <span className="text-sm text-foreground-main">{t("buttons.select_all")}</span>
              </label>
            </div>
          )}

          {/* Options List */}
          <ul className="max-h-48 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <li key={option.key} className="cursor-pointer px-2 py-2 hover:bg-background-main-card flex items-center">
                  <label className="flex items-center cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={selectedOptions.some((selected) => selected.key === option.key)}
                      onChange={() => handleOptionToggle(option)}
                      className="mr-2 text-template-color-primary accent-template-color-primary cursor-pointer"
                      aria-label={option.label}
                    />
                    <span
                      className={`flex-1 ${selectedOptions.some((selected) => selected.key === option.key)
                        ? 'text-template-color-primary'
                        : 'text-foreground-main'
                        }`}
                    >
                      {option.label}
                    </span>
                  </label>
                </li>
              ))
            ) : (
              <li className="px-2.5 py-2.5 text-sm text-gray-500 text-center" aria-live="polite">
                 {t("messages.no_options")}
              </li>
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

export default SelectMultiple;
