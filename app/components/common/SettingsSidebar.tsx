"use client";

import { useState, useEffect, useRef } from "react";
import { Cog6ToothIcon, SunIcon, MoonIcon, DeviceTabletIcon } from "@heroicons/react/24/outline";
import StorageUtils from "@/app/utils/storage/StorageUtils";
import StorageConstants from "@/app/utils/storage/StorageConstants";
import { useLayout } from "@/app/LayoutContext";
import { useTranslation } from "@/app/utils/language/i18n";


// Define Primary and Secondary Colors
const primaryColors = [
  { name: "Blue", color: "#2563EB" },           // Tailwind: blue-600
  { name: "Amber", color: "#F59E0B" },          // Tailwind: amber-500
  { name: "Emerald", color: "#059669" },        // Tailwind: emerald-600
  { name: "Violet", color: "#7C3AED" },         // Tailwind: violet-600
  { name: "Teal", color: "#0D9488" },           // Tailwind: teal-600
  { name: "Rose", color: "#E11D48" },           // Tailwind: rose-600
];

const secondaryColors = [
  { name: "Yellow", color: "#EAB308" },         // Tailwind: yellow-500
  { name: "Pink", color: "#EC4899" },           // Tailwind: pink-500
  { name: "Cyan", color: "#22D3EE" },           // Tailwind: cyan-400
  { name: "Orange", color: "#F97316" },         // Tailwind: orange-500
  { name: "Green", color: "#22C55E" },          // Tailwind: green-500
  { name: "Purple", color: "#A855F7" },         // Tailwind: purple-500
];

// Define Schemes with Icons
const schemes = [
  { name: "Auto", icon: <DeviceTabletIcon className="w-5 h-5" /> },
  { name: "Dark", icon: <MoonIcon className="w-5 h-5" /> },
  { name: "Light", icon: <SunIcon className="w-5 h-5" /> },
];

// Define Layouts
const layouts = ["Empty", "Classic", "Compact", "Modern"];

export default function SettingsSidebar() {

  const { t } = useTranslation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState<string>("Blue");
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState<string>("Yellow");
  const [selectedScheme, setSelectedScheme] = useState<string>("Auto");
  const { layout, setLayout } = useLayout();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPrimaryColor = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_COLOR_PRIMARY,
      false,
      "Blue"
    );
    const savedSecondaryColor = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_COLOR_SECONDARY,
      false,
      "Yellow"
    );
    const savedScheme = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_THEME,
      false,
      "Auto"
    );
    const savedLayout = StorageUtils.load<string>(
      StorageConstants.TEMPLATE_LAYOUT,
      false,
      "Classic"
    );
    setLayout(savedLayout);

    setSelectedPrimaryColor(savedPrimaryColor);
    setSelectedSecondaryColor(savedSecondaryColor);
    setSelectedScheme(savedScheme);

    const primaryColorObject = primaryColors.find((color) => color.name === savedPrimaryColor);
    const secondaryColorObject = secondaryColors.find((color) => color.name === savedSecondaryColor);

    if (primaryColorObject) {
      document.documentElement.style.setProperty("--template-color-primary", primaryColorObject.color);
    }
    if (secondaryColorObject) {
      document.documentElement.style.setProperty("--template-color-secondary", secondaryColorObject.color);
    }

    applyTheme(savedScheme);

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setLayout]);

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

  const handlePrimaryColorChange = (colorName: string) => {
    setSelectedPrimaryColor(colorName);
    StorageUtils.save(StorageConstants.TEMPLATE_COLOR_PRIMARY, colorName);
    const colorObject = primaryColors.find((color) => color.name === colorName);
    if (colorObject) {
      document.documentElement.style.setProperty("--template-color-primary", colorObject.color);
    }
  };

  const handleSecondaryColorChange = (colorName: string) => {
    setSelectedSecondaryColor(colorName);
    StorageUtils.save(StorageConstants.TEMPLATE_COLOR_SECONDARY, colorName);
    const colorObject = secondaryColors.find((color) => color.name === colorName);
    if (colorObject) {
      document.documentElement.style.setProperty("--template-color-secondary", colorObject.color);
    }
  };

  const handleSchemeChange = (scheme: string) => {
    setSelectedScheme(scheme);
    StorageUtils.save(StorageConstants.TEMPLATE_THEME, scheme);
    applyTheme(scheme);
  };

  const handleTemplateChange = (template: string) => {
    setLayout(template);
    StorageUtils.save(StorageConstants.TEMPLATE_LAYOUT, template);
  };

  return (
    <>
      {/* Settings Icon */}
      <div
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-template-color-primary text-white p-4 shadow-lg cursor-pointer flex items-center justify-center rounded-l-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Cog6ToothIcon className="w-8 h-8 animate-spin-slow" />
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-[28rem] bg-background-main text-foreground-main shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between px-6 header-height font-serif bg-template-color-primary"
        >
          <h2 className="text-xl font-bold tracking-wide text-white flex items-center space-x-2">
            <Cog6ToothIcon className="w-6 h-6" />
            <span>{t("theme.theme_settings")}</span>
          </h2>
          <button
            className="text-white text-2xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-6 space-y-8 font-sans">

          {/* Primary Color Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("theme.settings_primary")}</h3>
            <div className="grid grid-cols-3 gap-4">
              {primaryColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handlePrimaryColorChange(color.name)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-full ${selectedPrimaryColor === color.name
                    ? "bg-background-main-card-selected"
                    : "bg-background-main-card hover:bg-background-main-card-hover"
                    }`}
                  style={{
                    border: `2px solid ${selectedPrimaryColor === color.name ? "var(--template-color-primary)" : "transparent"
                      }`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <span className="text-sm font-medium text-foreground-main">
                    {t(`theme.color_${color.name.toLowerCase()}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Color Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("theme.settings_secondary")}</h3>
            <div className="grid grid-cols-3 gap-4">
              {secondaryColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleSecondaryColorChange(color.name)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-full ${selectedSecondaryColor === color.name
                    ? "bg-background-main-card-selected"
                    : "bg-background-main-card hover:bg-background-main-card-hover"
                    }`}
                  style={{
                    border: `2px solid ${selectedSecondaryColor === color.name ? "var(--template-color-secondary)" : "transparent"
                      }`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <span className="text-sm font-medium text-foreground-main">
                    {t(`theme.color_${color.name.toLowerCase()}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("theme.settings_theme")}</h3>
            <div className="grid grid-cols-3 gap-4">
              {schemes.map((scheme) => (
                <button
                  key={scheme.name}
                  onClick={() => handleSchemeChange(scheme.name)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-full ${selectedScheme === scheme.name
                    ? "bg-background-main-card-selected"
                    : "bg-background-main-card hover:bg-background-main-card-hover"
                    }`}
                  style={{
                    border: `2px solid ${selectedScheme === scheme.name ? "var(--template-color-primary)" : "transparent"
                      }`,
                  }}
                >
                  <div>{scheme.icon}</div>
                  <span className="text-sm font-medium text-foreground-main">
                    {t(`theme.theme_${scheme.name.toLowerCase()}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("theme.settings_layouts")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {layouts.map((layout_item) => (
                <button
                  key={layout_item}
                  onClick={() => handleTemplateChange(layout_item)}
                  className={`relative flex flex-col items-center border-2 rounded-lg p-4 ${layout === layout_item
                    ? "bg-background-main-card-selected"
                    : "bg-background-main-card hover:bg-background-main-card-hover"
                    }`}
                  style={{
                    borderColor:
                      layout === layout_item ? "var(--template-color-primary)" : "transparent",
                  }}
                >
                  <div className="w-full h-16 flex rounded-md overflow-hidden border">
                    {layout_item === "Empty" && (
                      <div className="flex flex-1 bg-background-secondary"></div>
                    )}
                    {layout_item === "Classic" && (
                      <div className="flex w-full">
                        <div className="w-6 bg-background-main-card-hover flex flex-col space-y-1 p-1">
                          <div className="h-1 bg-foreground-secondary rounded-sm"></div>
                          <div className="h-1 bg-foreground-secondary rounded-sm"></div>
                          <div className="h-1 bg-foreground-secondary rounded-sm"></div>
                          <div className="h-1 bg-foreground-secondary rounded-sm"></div>
                        </div>
                        <div className="flex flex-1 bg-background-secondary-card border-l"></div>
                      </div>
                    )}
                    {layout_item === "Compact" && (
                      <div className="flex w-full h-full">
                        <div className="w-4 bg-background-main-card-hover flex flex-col space-y-2 items-center py-2">
                          <div className="w-3 h-3 bg-foreground-secondary rounded-sm mt-1"></div>
                          <div className="w-3 h-3 bg-foreground-secondary rounded-sm"></div>
                          <div className="w-3 h-3 bg-foreground-secondary rounded-sm"></div>
                          <div className="w-3 h-3 bg-foreground-secondary rounded-sm"></div>
                        </div>
                        <div className="flex flex-1 bg-background-secondary-card border-l"></div>
                      </div>
                    )}
                    {layout_item === "Modern" && (
                      <div className="flex w-full h-full flex-col">
                        <div className="h-5 bg-background-main-card-hover border-b flex items-center px-2 space-x-2">
                          <div className="w-2 h-2 bg-foreground-secondary rounded-full"></div>
                          <div className="flex space-x-1 flex-1">
                            <div className="w-6 h-1 bg-foreground-secondary rounded-sm"></div>
                            <div className="w-6 h-1 bg-foreground-secondary rounded-sm"></div>
                            <div className="w-6 h-1 bg-foreground-secondary rounded-sm"></div>
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-foreground-secondary rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-foreground-secondary rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex flex-1 bg-background-secondary-card"></div>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium mt-2 text-foreground-main">
                    {t(`theme.layout_${layout_item.toLowerCase()}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

