'use client';

import React from 'react';

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface DialogCreateUpdateProps {
  isOpen: boolean;
  id?: string,
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  width?: string;
}

const DialogCreateUpdate: React.FC<DialogCreateUpdateProps> = ({
  isOpen,
  id,
  title,
  children,
  width = 'w-96',
}) => {

  const { t } = useTranslation();

  if (!isOpen) return null;

  const title_main = id ? t("buttons.edit") : t("buttons.create");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-background-main-card rounded-md shadow-lg ${width} p-6 relative`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground-main">{title_main} {title}</h2>
        </div>
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DialogCreateUpdate;
