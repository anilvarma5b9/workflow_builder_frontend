"use client";

import StorageConstants from "@/app/utils/storage/StorageConstants";
import StorageUtils from "@/app/utils/storage/StorageUtils";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';

interface LayoutContextProps {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  layout: string;
  setLayout: (layout: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [layout, setLayout] = useState<string>("Classic");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en"); // Default language

  // Load from storage only on mount
  useEffect(() => {
    const savedLanguage = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_LANGUAGE_CODE,
      false,
      "en"
    );
    if (savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
  }, [language]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout, isLoading, setLoading, language, setLanguage }}>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
      {/* Global Loader */}
      {isLoading && (
        <div className="global-loader">
          <div className="spinner"></div>
        </div>
      )}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
