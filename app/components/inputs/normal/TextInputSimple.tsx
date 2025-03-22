'use client';
import React from 'react';

type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'titlecase' | 'sentencecase';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  textTransform?: TextTransform;
  maxLength?: number;
}

const TextInputSimple = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, placeholder, error, textTransform = 'none', maxLength, ...props }, ref) => {
    const handleTextTransform = (value: string) => {
      switch (textTransform) {
        case 'uppercase':
          return value.toUpperCase();
        case 'lowercase':
          return value.toLowerCase();
        case 'titlecase':
          return value.replace(/\w\S*/g, (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          );
        case 'capitalize':
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        case 'sentencecase':
          return value.charAt(0).toUpperCase() + value.slice(1);
        default:
          return value;
      }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let transformedValue = e.target.value;
      if (maxLength && transformedValue.length > maxLength) {
        transformedValue = transformedValue.slice(0, maxLength);
      }
      transformedValue = handleTextTransform(transformedValue);
      props.onChange?.({ ...e, target: { ...e.target, value: transformedValue } });
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
          maxLength={maxLength}
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

TextInputSimple.displayName = 'TextInputSimple';
export default TextInputSimple;
