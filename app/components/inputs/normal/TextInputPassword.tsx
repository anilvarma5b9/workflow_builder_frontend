'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface TextInputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: string;
}

const TextInputPassword = React.forwardRef<HTMLInputElement, TextInputPasswordProps>(
  ({ label, placeholder, error, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
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
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder={placeholder}
            className={`w-full px-2.5 py-2.5 text-sm rounded-md border transition duration-150 ease-in-out shadow-sm
        ${error ? 'border-red-500' : 'border-medium hover:border-template-color-primary focus-within:border-template-color-primary'}
              bg-background-main text-foreground-main pr-10`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-template-color-primary focus:outline-none"
            tabIndex={-1} // Prevents the button from interfering with form navigation
          >
            {isPasswordVisible ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error Message */}
        <div className="mt-1 h-1 text-sm">
          {error && <p className="text-red-500">{error}</p>}
        </div>
        
      </div>
    );
  }
);

TextInputPassword.displayName = 'TextInputPassword';
export default TextInputPassword;
