'use client';

import React, { useCallback } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import DeleteConfirmation from '@/app/components/dialog/DeleteConfirmation';

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface BasicTableActionsProps {
    rowId: string;
    onEdit?: () => void;
    onDelete?: (id: string) => Promise<{ status: boolean; message?: string }>;
    title: string;
    onSuccess?: () => void;
}

const ActionButton: React.FC<{
    onClick: () => void;
    title: string;
    ariaLabel: string;
    icon: React.ReactNode;
    colorClass: string;
}> = React.memo(({ onClick, title, ariaLabel, icon, colorClass }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center w-8 h-8 ${colorClass} rounded-full transition`}
        title={title}
        aria-label={ariaLabel}
    >
        {icon}
    </button>
));

ActionButton.displayName = "ActionButton";

const BasicTableActions: React.FC<BasicTableActionsProps> = React.memo(
    ({ rowId, onEdit, onDelete, title, onSuccess }) => {
        const confirmDelete = useCallback(async (): Promise<{ status: boolean; message?: string }> => {
            if (!onDelete) {
                return { status: false, message: "Delete action not available" };
            }

            const response = await onDelete(rowId);

            if (response.status && onSuccess) {
                onSuccess();
            }

            return response;
        }, [onDelete, rowId, onSuccess]);

        const { t } = useTranslation();

        return (
            <div className="flex items-center space-x-4">
                {/* ✅ Edit Button */}
                {onEdit && (
                    <ActionButton
                        onClick={onEdit}
                        title={t("buttons.edit")}
                        ariaLabel={t("buttons.edit")}
                        icon={<FaEdit className="w-4 h-4" />}
                        colorClass="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200"
                    />
                )}

                {/* ✅ Delete Button (Wrapped in DeleteConfirmation) */}
                {onDelete && (
                    <DeleteConfirmation id={rowId} apiMethod={confirmDelete} title={title}>
                        <ActionButton
                            onClick={() => { }}
                            title={t("buttons.delete")}
                            ariaLabel={t("buttons.delete")}
                            icon={<FaTrashAlt className="w-4 h-4" />}
                            colorClass="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200"
                        />
                    </DeleteConfirmation>
                )}
            </div>
        );
    }
);

BasicTableActions.displayName = "BasicTableActions";

export default BasicTableActions;
