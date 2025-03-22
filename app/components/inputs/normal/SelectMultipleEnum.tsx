'use client';

import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { convertEnumToOptions } from '@/app/components/inputs/input_types';

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface SelectMultipleEnumProps<T> {
  label: string;
  placeholder?: string;
  error?: string;
  enumType: T;
  value: Array<keyof T>;
  onChange: (values: Array<keyof T>) => void;
}

const SelectMultipleEnum = <T extends object>({
  label,
  placeholder = label,
  error,
  enumType,
  value,
  onChange,
}: SelectMultipleEnumProps<T>) => {

  const { t } = useTranslation();

  // ✅ Memoized options (Prevents unnecessary recalculations)
  const options = useMemo(() => convertEnumToOptions(enumType), [enumType]);

  // ✅ Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Handle Option Toggle (Fixed Selection Issue)
  const handleOptionToggle = useCallback(
    (optionKey: keyof T) => {
      const updatedValues = value.includes(optionKey)
        ? value.filter((val) => val !== optionKey)
        : [...value, optionKey];

      onChange(updatedValues);
    },
    [onChange, value]
  );

  // ✅ Toggle "Select All"
  const handleSelectAllToggle = useCallback(
    (selectAll: boolean) => {
      onChange(selectAll ? options.map((opt) => opt.key as keyof T) : []);
    },
    [options, onChange]
  );

  // ✅ Handle clicks outside the dropdown
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

  // ✅ Display selected values
  const displaySelected = () =>
    value.map((selectedKey) => options.find((opt) => opt.key === selectedKey)?.label).join(', ') || placeholder;

  // ✅ Check if all options are selected
  const isAllSelected = value.length === options.length;

  return (
    <div className="mb-1 relative w-full" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label
          className="block mb-1 text-sm font-semibold text-foreground-main"
        >
          {label}
        </label>
      )}

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
          {value.length > 0 ? displaySelected() : placeholder}
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
              <label className="flex items-center cursor-pointer">
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
                <li
                  key={option.key}
                  className="cursor-pointer px-2 py-2 hover:bg-background-main-card flex items-center"
                >
                  <label className="flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value.includes(option.key as keyof T)}
                      onChange={() => handleOptionToggle(option.key as keyof T)}
                      className="mr-2 text-template-color-primary accent-template-color-primary cursor-pointer"
                      aria-label={option.label}
                    />
                    <span
                      className={`${value.includes(option.key as keyof T)
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

export default SelectMultipleEnum;
