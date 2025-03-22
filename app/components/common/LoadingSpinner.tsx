"use client";

import React from "react";
import { useLayout } from "@/app/LayoutContext";

const LoadingSpinner: React.FC = () => {
  const { isLoading } = useLayout();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
      <div className="w-16 h-16 border-4 border-template-color-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
