'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import DialogCreateUpdate from '@/app/components/dialog/DialogCreateUpdate';
import TextInputSimple from '@/app/components/inputs/normal/TextInputSimple';
import TextInputArea from '@/app/components/inputs/normal/TextInputArea';
import FormActions from '@/app/components/forms/FormActions';

interface NodeEditModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
    initialLabel: string;
    initialDescription: string;
}

const NodeSchema = z.object({
    label: z.string().min(1, 'Label is required').max(100),
    description: z.string().optional(),
});

type NodeFormData = z.infer<typeof NodeSchema>;

const NodeEditModal: React.FC<NodeEditModalProps> = ({
    open,
    onClose,
    onSave,
    initialLabel,
    initialDescription,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NodeFormData>({
        resolver: zodResolver(NodeSchema),
        defaultValues: {
            label: initialLabel,
            description: initialDescription,
        },
    });

    useEffect(() => {
        if (open) {
            console.log(initialLabel);
            reset({
                label: initialLabel,
                description: initialDescription,
            });
        }
    }, [open, initialLabel, initialDescription, reset]);

    const onSubmit = (data: NodeFormData) => {
        onSave(data.label.trim(), data.description?.trim() || '');
    };

    return (
        <DialogCreateUpdate isOpen={open} onClose={onClose} title="Edit Node">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <TextInputSimple
                    label="Node Label"
                    placeholder="Enter node label"
                    error={errors.label?.message}
                    maxLength={100}
                    textTransform='sentencecase'
                    {...register('label')}
                />

                <TextInputArea
                    label="Node Description"
                    placeholder="Enter description"
                    error={errors.description?.message}
                    rows={3}
                    textTransform='sentencecase'
                    {...register('description')}
                />

                <FormActions
                    onClose={onClose}
                    onSubmitText="Save"
                    isSubmitting={isSubmitting}
                />
            </form>
        </DialogCreateUpdate>
    );
};

export default NodeEditModal;
