'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import TextInputSimple from '@/app/components/inputs/normal/TextInputSimple';
import TextInputArea from '@/app/components/inputs/normal/TextInputArea';
import SelectSingleEnum from '@/app/components/inputs/normal/SelectSingleEnum';
import { WorkflowStatus } from '@/api/Enums';
import { useTranslation } from '@/app/utils/language/i18n';

const WorkflowSchema = z.object({
    workflow_name: z.string().min(1, 'Workflow name is required').max(100),
    workflow_description: z.string().optional(),
    workflow_status: z.nativeEnum(WorkflowStatus, {
        errorMap: () => ({ message: 'Workflow status is required' }),
    }),
});

type WorkflowFormData = z.infer<typeof WorkflowSchema>;

interface WorkflowFormProps {
    defaultValues: WorkflowFormData;
    validationMsg: string;
    onSave: (data: WorkflowFormData) => void;
    onClear: () => void;
}

const WorkflowFormPanel: React.FC<WorkflowFormProps> = ({
    defaultValues,
    validationMsg,
    onSave,
    onClear,
}) => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<WorkflowFormData>({
        resolver: zodResolver(WorkflowSchema),
        defaultValues,
    });

    const handleClear = () => {
        reset(defaultValues);
        onClear();
    };

    return (
        <form
            onSubmit={handleSubmit(onSave)}
            className="w-[300px] border-l bg-white p-4 shadow flex flex-col gap-4"
        >
            <h2 className="text-lg font-semibold text-foreground-main">
                {t('p_workflow.workflow_info')}
            </h2>

            {/* Workflow Name */}
            <Controller
                name="workflow_name"
                control={control}
                render={({ field }) => (
                    <TextInputSimple
                        {...field}
                        value={field.value ?? ''}
                        label={t('p_workflow.workflow_name')}
                        placeholder={t('p_workflow.workflow_name_placeholder')}
                        error={errors.workflow_name?.message}
                        textTransform="sentencecase"
                        maxLength={100}
                    />
                )}
            />

            {/* Workflow Description */}
            <Controller
                name="workflow_description"
                control={control}
                render={({ field }) => (
                    <TextInputArea
                        {...field}
                        label={t('p_workflow.workflow_description')}
                        placeholder={t('p_workflow.workflow_description_placeholder')}
                        error={errors.workflow_description?.message}
                        textTransform="sentencecase"
                        rows={3}
                    />
                )}
            />

            {/* Workflow Status */}
            <Controller
                name="workflow_status"
                control={control}
                render={({ field }) => (
                    <SelectSingleEnum
                        {...field}
                        label={t('p_workflow.workflow_status')}
                        placeholder={t('p_workflow.workflow_status_placeholder')}
                        error={errors.workflow_status?.message}
                        enumType={WorkflowStatus}
                        onChange={field.onChange}
                    />
                )}
            />

            {/* Validation Message */}
            <div className="text-sm">
                <strong className="text-foreground-main">{t('p_workflow.validation_title')}:</strong>
                <br />
                <span className={validationMsg === 'Valid' ? 'text-green-600' : 'text-red-600'}>
                    {validationMsg}
                </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-6 py-2 rounded-md text-template-color-primary border border-template-color-primary hover:bg-template-color-primary hover:text-white transition duration-200"
                >
                    {t('buttons.close')}
                </button>

                <button
                    type="submit"
                    className={`px-6 py-2 rounded-md text-white bg-template-color-primary hover:bg-template-color-secondary transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={isSubmitting}
                >
                    {t('buttons.save')}
                </button>
            </div>
        </form>
    );
};

export default WorkflowFormPanel;
