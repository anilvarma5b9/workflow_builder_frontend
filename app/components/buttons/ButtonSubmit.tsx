'use client';

import React from 'react';

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface ButtonSubmitProps {
  onClick: () => void; // Callback for button click
  label?: string; // Custom label for the button
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ onClick, label }) => {

  const { t } = useTranslation();
  const submit = t("buttons.submit");
  
  return (
    <button
      onClick={onClick}
      className="w-32 px-4 py-2 bg-template-color-primary text-white rounded-md hover:bg-template-color-secondary transition"
    >
      {label || submit}
    </button>
  );
};

export default ButtonSubmit;
