'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

interface MyDateTimePickerProps {
  label?: string;
  placeholder?: string;
  error?: string;
  value?: Date | null;
  onChange?: (dateTime: Date | null) => void;
  disabled?: boolean; // Option to disable the picker
}

const PickerDateTime: React.FC<MyDateTimePickerProps> = ({
  label,
  placeholder = label,
  error,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4 relative">
      {/* Label */}
      {label && (
        <label className="block mb-1 text-sm font-semibold text-foreground-main">
          {label}
        </label>
      )}

      {/* Input with Icon */}
      <div className="relative">
        <ReactDatePicker
          selected={value}
          onChange={(dateTime) => onChange?.(dateTime || null)}
          placeholderText={placeholder}
          disabled={disabled}
          showTimeSelect
          timeIntervals={15} // Time interval in minutes
          dateFormat="MM/dd/yyyy hh:mm aa" // Example: 01/20/2025 02:30 PM
          className={`w-full px-2.5 py-2.5 text-sm rounded-md border transition duration-150 ease-in-out shadow-sm
            ${error
              ? 'border-red-500 focus:border-red-500'
              : 'border-medium focus:border-template-color-primary'
            }
            bg-background-main text-foreground-main pr-10 cursor-pointer`}
        />

        {/* Calendar Icon */}
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <FaCalendarAlt className="text-template-color-primary" size={16} />
        </div>
      </div>

      {/* Error Message */}
      <div className="mt-1 h-1 text-sm">
        {error && <p className="text-red-500">{error}</p>}
      </div>

    </div>
  );
};

export default PickerDateTime;
