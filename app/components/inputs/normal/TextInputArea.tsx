'use client';
import React, { useRef } from 'react';

type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'titlecase' | 'sentencecase';

interface TextInputAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  textTransform?: TextTransform;
  maxLength?: number;
  rows?: number; // Controls the initial height
}

const TextInputArea = React.forwardRef<HTMLTextAreaElement, TextInputAreaProps>(
  ({ label, placeholder, error, textTransform = 'none', maxLength, rows = 3, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
        case 'sentencecase':
          return value.charAt(0).toUpperCase() + value.slice(1);
        default:
          return value;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let transformedValue = e.target.value;

      if (maxLength && transformedValue.length > maxLength) {
        transformedValue = transformedValue.slice(0, maxLength);
      }
      transformedValue = handleTextTransform(transformedValue);
      props.onChange?.({ ...e, target: { ...e.target, value: transformedValue } });

      // Adjust height dynamically
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
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
        <textarea
          ref={(node) => {
            if (ref) {
              if (typeof ref === 'function') ref(node);
              else ref.current = node;
            }
            textareaRef.current = node;
          }}
          {...props}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={handleChange}
          rows={rows}
          className={`w-full px-2.5 py-2.5 text-sm rounded-md border transition duration-150 ease-in-out shadow-sm
        ${error ? 'border-red-500' : 'border-medium hover:border-template-color-primary focus-within:border-template-color-primary'}
            bg-background-main text-foreground-main resize-none`}
          style={{ overflow: 'hidden' }}
        />

        {/* Error Message */}
        <div className="mt-1 h-1 text-sm">
          {error && <p className="text-red-500">{error}</p>}
        </div>

      </div>
    );
  }
);

TextInputArea.displayName = 'TextInputArea';
export default TextInputArea;
