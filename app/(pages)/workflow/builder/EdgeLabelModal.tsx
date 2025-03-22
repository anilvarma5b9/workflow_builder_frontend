'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import DialogCreateUpdate from '@/app/components/dialog/DialogCreateUpdate';
import SelectSingle from '@/app/components/inputs/normal/SelectSingle';
import FormActions from '@/app/components/forms/FormActions';

interface EdgeLabelModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (label: string) => void;
}

const predefinedOptions = ['Yes', 'No', 'Maybe', 'True', 'False'];
const labelOptions = predefinedOptions.map((opt) => ({ key: opt, label: opt }));

const EdgeLabelSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

type EdgeLabelFormData = z.infer<typeof EdgeLabelSchema>;

const EdgeLabelModal: React.FC<EdgeLabelModalProps> = ({ open, onClose, onSave }) => {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch
  } = useForm<EdgeLabelFormData>({
    resolver: zodResolver(EdgeLabelSchema),
    defaultValues: {
      label: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({ label: '' });
    }
  }, [open, reset]);

  const selectedLabel = watch('label');

  const handleFormSubmit = (data: EdgeLabelFormData) => {
    onSave(data.label);
  };

  return (
    <DialogCreateUpdate isOpen={open} onClose={onClose} title="Label this Decision Path">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

        <SelectSingle
          label="Choose Label"
          options={labelOptions}
          error={errors.label?.message}
          value={selectedLabel}
          placeholder="Select a label"
          onChange={(val) => setValue('label', val)}
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

export default EdgeLabelModal;
