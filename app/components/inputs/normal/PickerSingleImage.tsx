'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaImage, FaTimesCircle } from 'react-icons/fa';

interface PickerSingleImageProps {
  label?: string;
  error?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
}

const PickerSingleImage: React.FC<PickerSingleImageProps> = ({
  label,
  error,
  value,
  onChange,
}) => {
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    } else {
      setPreview(null);
      onChange?.(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange?.(null);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-semibold text-foreground-main">
          {label}
        </label>
      )}

      <div
        className={`relative w-full h-48 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden ${error
          ? 'border-red-500'
          : 'border-medium hover:border-template-color-primary'
          } bg-background-main transition duration-150 ease-in-out`}
      >
        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Preview or Placeholder */}
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Selected"
              layout="fill"
              objectFit="cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white rounded-full text-red-500 shadow-md p-1 hover:bg-gray-200"
            >
              <FaTimesCircle size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-template-color-primary">
            <FaImage size={32} />
            <span className="mt-2 text-sm">Click to select an Image</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      <div className="mt-1 h-1 text-sm">
        {error && <p className="text-red-500">{error}</p>}
      </div>

    </div>
  );
};

export default PickerSingleImage;
