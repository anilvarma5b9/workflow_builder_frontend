'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteHandleError } from '@/app/utils/api_errors/deleterHandleError';
import { useLayout } from '@/app/LayoutContext';


// Language
import { useTranslation } from "@/app/utils/language/i18n";

interface DeleteConfirmationProps {
    id: string;
    title: string;
    apiMethod: (id: string) => Promise<{ status: boolean; message?: string }>;
    onSuccess?: () => void;
    children: React.ReactNode;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    id,
    title,
    apiMethod,
    onSuccess,
    children,
}) => {

    const { t } = useTranslation();
    
    const [isOpen, setIsOpen] = useState(false);

    const { setLoading } = useLayout();

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await apiMethod(id);
            if (response.status) {
                toast.success(response.message);
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            deleteHandleError(error);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <div onClick={() => setIsOpen(true)}>{children}</div>

            {/* Confirmation Dialog */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-background-main-card rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-lg font-bold text-template-color-primary mb-4">
                            {t("buttons.delete")} {title}
                        </h3>
                        <p className="text-foreground-main mb-6">
                        {t("messages.delete_confirmation")} {title}?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-md text-template-color-primary border border-template-color-primary hover:bg-template-color-primary hover:text-white transition duration-200"
                            >
                                {t("buttons.cancel")} 
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md text-white bg-template-color-primary hover:bg-template-color-secondary transition duration-200"
                            >
                                {t("buttons.confirm")} 
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteConfirmation;
