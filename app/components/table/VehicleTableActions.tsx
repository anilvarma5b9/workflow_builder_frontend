'use client';

import React, { useCallback } from 'react';
import { FaEdit, FaTrashAlt, FaFileAlt, FaShoppingCart, FaSyncAlt, FaCar } from 'react-icons/fa';
import DeleteConfirmation from '@/app/components/dialog/DeleteConfirmation';

// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface VehicleTableActionsProps {
    rowId: string;
    onEdit?: () => void;
    onEditDetailsBody?: () => void;
    onEditDetailLifeCycle?: () => void;
    onEditDetailPurchase?: () => void;
    onEditDocuments?: () => void;
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

const VehicleTableActions: React.FC<VehicleTableActionsProps> = React.memo(
    ({ rowId, onEdit, onEditDetailsBody, onEditDetailLifeCycle, onEditDetailPurchase, onEditDocuments, onDelete, title, onSuccess }) => {
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

                {/* ✅ Edit Vehicle Body Details */}
                {onEditDetailsBody && (
                    <ActionButton
                        onClick={onEditDetailsBody}
                        title={t("buttons.edit_body_details")}
                        ariaLabel={t("buttons.edit_body_details")}
                        icon={<FaCar className="w-4 h-4" />}
                        colorClass="text-green-500 hover:text-green-700 bg-green-100 hover:bg-green-200"
                    />
                )}

                {/* ✅ Edit Vehicle Life Cycle Details */}
                {onEditDetailLifeCycle && (
                    <ActionButton
                        onClick={onEditDetailLifeCycle}
                        title={t("buttons.edit_lifecycle_details")}
                        ariaLabel={t("buttons.edit_lifecycle_details")}
                        icon={<FaSyncAlt className="w-4 h-4" />}
                        colorClass="text-yellow-500 hover:text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                    />
                )}

                {/* ✅ Edit Purchase Details */}
                {onEditDetailPurchase && (
                    <ActionButton
                        onClick={onEditDetailPurchase}
                        title={t("buttons.edit_purchase_details")}
                        ariaLabel={t("buttons.edit_purchase_details")}
                        icon={<FaShoppingCart className="w-4 h-4" />}
                        colorClass="text-purple-500 hover:text-purple-700 bg-purple-100 hover:bg-purple-200"
                    />
                )}

                {/* ✅ Edit Vehicle Documents */}
                {onEditDocuments && (
                    <ActionButton
                        onClick={onEditDocuments}
                        title={t("buttons.edit_documents")}
                        ariaLabel={t("buttons.edit_documents")}
                        icon={<FaFileAlt className="w-4 h-4" />}
                        colorClass="text-indigo-500 hover:text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
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

VehicleTableActions.displayName = "BasicTableActions";

export default VehicleTableActions;
