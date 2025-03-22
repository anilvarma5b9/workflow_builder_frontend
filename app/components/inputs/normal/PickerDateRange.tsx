'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

interface PickerDateRangeProps {
  label?: string;
  placeholder?: string;
  error?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange?: (dates: [Date | null, Date | null]) => void;
  disabled?: boolean;
}

const PickerDateRange: React.FC<PickerDateRangeProps> = ({
  label,
  placeholder = label,
  error,
  startDate,
  endDate,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-1 relative">
      {/* Label */}
      {label && (
        <label className="block mb-1 text-sm font-semibold text-foreground-main">
          {label}
        </label>
      )}

      {/* Input with Icon */}
      <div className="relative">
        <ReactDatePicker
          selected={startDate}
          onChange={(dates: [Date | null, Date | null]) => onChange?.(dates)}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          placeholderText={placeholder}
          disabled={disabled}
          dateFormat="dd MMM yyyy"
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

export default PickerDateRange;
