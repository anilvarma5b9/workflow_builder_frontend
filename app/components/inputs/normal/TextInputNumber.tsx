'use client';
import React, { useState } from 'react';

interface TextInputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

const TextInputNumber = React.forwardRef<HTMLInputElement, TextInputNumberProps>(
  ({ label, placeholder, error, min, max, step, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<number | string | null>(
      props.value ? parseFloat(props.value.toString()) : null
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let transformedValue = e.target.value;

      // Validate min and max if provided
      if (min !== undefined && parseFloat(transformedValue) < min) {
        transformedValue = min.toString();
      }
      if (max !== undefined && parseFloat(transformedValue) > max) {
        transformedValue = max.toString();
      }

      // Convert the string to a number (or null if it's empty)
      const numericValue = transformedValue === '' ? null : parseFloat(transformedValue);

      setInputValue(numericValue);

      // Convert numericValue back to a string before passing to onChange
      const valueForOnChange = numericValue === null ? '' : numericValue?.toString();

      props.onChange?.({ ...e, target: { ...e.target, value: valueForOnChange } });
    };

    return (
      <div className="mb-1">
        {label && (
          <label
            className="block mb-1 text-sm font-semibold text-foreground-main"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          type="number"
          value={inputValue === null ? '' : inputValue.toString()}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={handleChange}
          className={`w-full px-2.5 py-2.5 text-sm rounded-md border transition duration-150 ease-in-out shadow-sm
         ${error ? 'border-red-500' : 'border-medium hover:border-template-color-primary focus-within:border-template-color-primary'}
            bg-background-main text-foreground-main`}
        />

        {/* Error Message */}
        <div className="mt-1 h-1 text-sm">
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    );
  }
);

TextInputNumber.displayName = 'TextInputNumber';
export default TextInputNumber;