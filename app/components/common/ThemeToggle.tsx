"use client";

import React, { useState, useEffect } from "react";
import { SunIcon, MoonIcon, DeviceTabletIcon } from "@heroicons/react/24/outline";
import StorageUtils from "@/app/utils/storage/StorageUtils";
import StorageConstants from "@/app/utils/storage/StorageConstants";

const ThemeToggle = () => {
  const [selectedScheme, setSelectedScheme] = useState<string>("Auto");

  useEffect(() => {
    const savedScheme = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_THEME,
      false,
      "Auto"
    );
    setSelectedScheme(savedScheme);
    applyTheme(savedScheme);
  }, []);

  const applyTheme = (scheme: string) => {
    document.body.classList.remove("theme-light", "theme-dark");
    if (scheme === "Auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.add(prefersDark ? "theme-dark" : "theme-light");
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.body.classList.add(scheme === "Dark" ? "theme-dark" : "theme-light");
      document.documentElement.setAttribute("data-theme", scheme === "Dark" ? "dark" : "light");
    }
  };

  const toggleTheme = () => {
    const newScheme =
      selectedScheme === "Auto"
        ? "Light"
        : selectedScheme === "Light"
        ? "Dark"
        : "Auto";

    setSelectedScheme(newScheme);
    StorageUtils.save(StorageConstants.TEMPLATE_THEME, newScheme);
    applyTheme(newScheme);
  };

  const getIcon = () => {
    if (selectedScheme === "Auto") {
      return <DeviceTabletIcon className="w-6 h-6" />;
    }
    if (selectedScheme === "Light") {
      return <SunIcon className="w-6 h-6" />;
    }
    return <MoonIcon className="w-6 h-6" />;
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center text-foreground-main hover:text-template-color-primary"
      aria-label="Toggle Theme"
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
