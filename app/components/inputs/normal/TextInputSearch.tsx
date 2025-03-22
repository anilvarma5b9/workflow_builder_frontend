'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'titlecase';

interface TextInputSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  placeholder?: string;
  error?: string;
  textTransform?: TextTransform;
  maxLength?: number;
  onChange?: (value: string) => void; // Custom onChange type that accepts a string
}

const TextInputSearch = React.forwardRef<HTMLInputElement, TextInputSearchProps>(
  ({ label, placeholder, error, textTransform = 'titlecase', maxLength, onChange, ...props }, ref) => {
    const handleTextTransform = (value: string) => {
      switch (textTransform) {
        case 'uppercase':
          return value.toUpperCase();
        case 'lowercase':
          return value.toLowerCase();
        case 'capitalize':
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        case 'titlecase':
          return value.replace(/\w\S*/g, (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          );
        default:
          return value;
      }
    };

    const [inputValue, setInputValue] = useState<string>(props.value?.toString() || '');

    useEffect(() => {
      setInputValue(props.value?.toString() || '');
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let transformedValue = e.target.value;
      if (maxLength && transformedValue.length > maxLength) {
        transformedValue = transformedValue.slice(0, maxLength);
      }
      transformedValue = handleTextTransform(transformedValue);
      setInputValue(transformedValue);
      onChange?.(transformedValue); // Pass the transformed value to the parent
    };

    return (
      <div className="mb-1 relative w-full">
        {label && (
          <label
            className="block mb-1 text-sm font-semibold text-foreground-main"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleChange}
            className={`w-full pl-10 pr-2.5 py-2.5 text-sm rounded-md border transition duration-150 ease-in-out shadow-sm
        ${error ? 'border-red-500' : 'border-medium hover:border-template-color-primary focus-within:border-template-color-primary'}
              bg-background-main text-foreground-main`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-template-color-primary" />
        </div>

        {/* Error Message */}
        <div className="mt-1 h-1 text-sm">
          {error && <p className="text-red-500">{error}</p>}
        </div>

      </div>
    );
  }
);

TextInputSearch.displayName = 'TextInputSearch';
export default TextInputSearch;
