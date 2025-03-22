'use client';

import React from 'react';
import { WorkflowStatus } from '@/api/Enums';

interface GridStatusProps {
  status: WorkflowStatus | string;
}

const statusColors: Record<WorkflowStatus, string> = {
  [WorkflowStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [WorkflowStatus.Inprogress]: 'bg-blue-100 text-blue-800',
  [WorkflowStatus.Completed]: 'bg-green-100 text-green-700',
  [WorkflowStatus.Inactive]: 'bg-gray-200 text-gray-700',
};

const GridStatus: React.FC<GridStatusProps> = ({ status }) => {
  const statusClass = statusColors[status as WorkflowStatus] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
      {status}
    </span>
  );
};

export default GridStatus;
