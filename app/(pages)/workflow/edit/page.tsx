'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import WorkflowBuilder from '../builder/WorkflowBuilder';
import { findUserWorkflowById } from '@/api/services/workflow_manager_service';
import { UserWorkflow } from '@/api/services/workflow_manager_service';
import { toast } from 'react-hot-toast';

const EditWorkflowPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [workflow, setWorkflow] = useState<UserWorkflow | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error('Invalid workflow ID');
      router.replace('/workflow/list');
      return;
    }

    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        const response = await findUserWorkflowById(id);
        if (response.status && response.data) {
          setWorkflow(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch workflow');
          router.replace('/workflow/list');
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong while fetching workflow');
        router.replace('/workflow/list');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [id, router]);

  if (loading) return <div className="p-8 text-center">Loading workflow...</div>;
  if (!workflow) return <div className="p-8 text-center">Workflow not found</div>;

  return <WorkflowBuilder initialData={workflow} />;
};

export default EditWorkflowPage;
