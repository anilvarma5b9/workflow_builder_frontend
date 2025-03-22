'use client';

import React from 'react';
import {
  HiPlay,
  HiStop,
  HiCog,
  HiQuestionMarkCircle,
} from 'react-icons/hi2';

type NodeType = 'start' | 'end' | 'action' | 'decision';

const nodeConfig: Record<NodeType, {
  label: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
}> = {
  start: {
    label: 'Start Node',
    icon: <HiPlay className="text-green-600 text-lg" />,
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700',
  },
  end: {
    label: 'End Node',
    icon: <HiStop className="text-red-600 text-lg" />,
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
  },
  action: {
    label: 'Action Node',
    icon: <HiCog className="text-blue-600 text-lg" />,
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-700',
  },
  decision: {
    label: 'Decision Node',
    icon: <HiQuestionMarkCircle className="text-yellow-600 text-lg" />,
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
  },
};

const DragPanel = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-48 p-4 space-y-3 bg-gray-50 border-r shadow-inner">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Node Types</h2>
      {Object.entries(nodeConfig).map(([type, config]) => (
        <div
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type as NodeType)}
          className={`flex items-center gap-2 px-3 py-1 text-xs rounded cursor-move border ${config.bg} ${config.border} ${config.text} shadow-sm`}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DragPanel;
