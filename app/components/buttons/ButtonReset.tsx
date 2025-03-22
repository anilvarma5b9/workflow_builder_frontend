"use client";

import React from "react";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface ButtonResetProps {
  onClick: () => void; // Callback for button click
  label?: string; // Custom label for the button
  icon?: React.ReactNode; // Optional icon before the label
}

const ButtonReset: React.FC<ButtonResetProps> = ({ onClick, label, icon }) => {

  const { t } = useTranslation();
  const reset = t("buttons.reset");

  return (
    <button
      onClick={onClick}
      className="group w-32 px-4 py-2 border border-medium text-template-color-primary rounded-md hover:bg-template-color-primary hover:text-white transition flex items-center justify-center space-x-2"
    >
      {icon && (
        <span className="text-template-color-primary transition-colors duration-200 group-hover:text-white">
          {icon}
        </span>
      )}
      <span>{label || reset}</span>
    </button>
  );
};

export default ButtonReset;
