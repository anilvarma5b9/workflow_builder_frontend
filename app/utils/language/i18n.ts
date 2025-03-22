"use client";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import { useLayout } from "@/app/LayoutContext";

// Define a type that allows deeply nested objects
type NestedTranslationObject = { [key: string]: string | NestedTranslationObject };

// Define allowed language keys
type TranslationKeys = "en" | "hi";

// Define translations object with correct typing
const translations: Record<TranslationKeys, NestedTranslationObject> = {
  en,
  hi,
};

/**
 * Recursively gets the translated text from a nested object.
 * @param obj - The translation object.
 * @param path - The key path as a string (e.g., "p_organisation_branch.branch_address").
 * @returns The translated string or the key itself if not found.
 */
const getNestedTranslation = (obj: NestedTranslationObject, path: string): string => {
  return path.split(".").reduce<unknown>(
    (acc, part) => (acc && typeof acc === "object" ? (acc as NestedTranslationObject)[part] : undefined),
    obj
  ) as string || path;
};

/**
 * Custom translation hook.
 * @returns A function `t(key)` to get translated text.
 */
export const useTranslation = () => {
  const { language } = useLayout();

  const t = (key: string): string => {
    return (
      getNestedTranslation(translations[language as TranslationKeys], key) ||
      getNestedTranslation(translations["en"], key) || // Fallback to English
      key
    );
  };

  return { t };
};
