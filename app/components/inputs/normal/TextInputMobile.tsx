'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { AsYouType, CountryCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  name: string;
  dialCode: string;
}

interface TextInputMobileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  countries?: Country[]; // List of countries to display
  defaultCountryCode?: string; // Default country code (e.g., "+1")
  autoFormat?: boolean; // Enable or disable auto-formatting
  showCountryCode?: boolean; // Display country dropdown or not
}

const TextInputMobile: React.FC<TextInputMobileProps> = ({
  label,
  placeholder,
  error,
  countries = [],
  defaultCountryCode = '+1',
  autoFormat = true,
  showCountryCode = true,
  ...props
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((country) => country.dialCode === defaultCountryCode) || countries[0]
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setInputValue(''); // Reset input value when changing country
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove all non-numeric characters for processing
    const numericValue = value.replace(/[^0-9]/g, '');

    // Auto-format using libphonenumber-js
    if (autoFormat) {
      const formatter = new AsYouType(selectedCountry.code as CountryCode);
      value = formatter.input(numericValue);
    }

    setInputValue(value);
    props.onChange?.({ ...e, target: { ...e.target, value } });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-1 relative">
      {/* Label */}
      {label && (
        <label className="block mb-1 text-sm font-semibold text-foreground-main">
          {label}
        </label>
      )}

      {/* Country Selector and Input */}
      <div className="flex items-center relative">
        {showCountryCode && (
          <div
            className={`flex items-center w-20 px-2 py-2 text-sm bg-background-main border border-gray-300 rounded-l-md cursor-pointer ${isDropdownOpen ? 'focus:ring-template-color-primary' : ''
              }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            ref={dropdownRef}
          >
            <span className="text-template-color-primary">{selectedCountry.dialCode}</span>
            {isDropdownOpen ? (
              <FaChevronUp className="ml-auto text-template-color-primary" />
            ) : (
              <FaChevronDown className="ml-auto text-template-color-primary" />
            )}
          </div>
        )}

        <input
          {...props}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          className={`w-full px-2.5 py-2.5 text-sm ${showCountryCode ? 'rounded-r-md' : 'rounded-md'
            } border transition duration-150 ease-in-out shadow-sm
        ${error ? 'border-red-500' : 'border-medium hover:border-template-color-primary focus-within:border-template-color-primary'}
            bg-background-main text-foreground-main`}
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && showCountryCode && (
        <div
          className="absolute top-full left-0 w-full bg-white border border-medium shadow-lg z-10"
          ref={dropdownRef}
        >
          <input
            type="text"
            placeholder="Search country"
            className="w-full px-3 py-3 text-sm border-b border-medium focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
              <li
                key={country.code}
                onClick={() => handleCountryChange(country)}
                className="cursor-pointer px-2.5 py-2.5 hover:bg-gray-100 flex justify-between"
              >
                <span
                  className={`${country.code === selectedCountry.code
                      ? 'text-template-color-primary'
                      : 'text-foreground-main'
                    }`}
                >
                  {country.name} ({country.dialCode})
                </span>
                {country.code === selectedCountry.code && (
                  <FaCheck className="w-4 h-4 ml-auto mt-1 text-template-color-primary" />
                )}
              </li>
            ))}
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

export default TextInputMobile;
