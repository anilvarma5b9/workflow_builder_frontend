import React from "react";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface FormActionsProps {
  onClose?: () => void;
  onSubmitText: string;
  isSubmitting?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onClose,
  onSubmitText,
  isSubmitting = false,
}) => {

  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-4 mt-2">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 rounded-md text-template-color-primary border border-template-color-primary hover:bg-template-color-primary hover:text-white transition duration-200"
        >
          {t("buttons.close")}
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-2 rounded-md text-white bg-template-color-primary hover:bg-template-color-secondary transition duration-200 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {onSubmitText}
      </button>
    </div>
  );
};

export default FormActions;
