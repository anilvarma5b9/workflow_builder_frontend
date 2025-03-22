import { Handle, NodeProps, Position, useStore } from '@xyflow/react';
import React, { ReactNode } from 'react';

export interface NodeData extends Record<string, unknown> {
  label: string;
  description: string;
}

// 🔁 Compact Label Component
const NodeLabel = ({ icon, label, color }: { icon: ReactNode; label: ReactNode; color: string }) => (
  <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-gray-700 max-w-[140px] truncate">
    <span className={color}>{icon}</span>
    <span className="truncate">{label}</span>
  </div>
);

// ✅ START NODE
export const StartNode: React.FC<NodeProps> = ({ id, data }) => {
  const outgoingCount = useStore((s) => s.edges.filter((e) => e.source === id).length);
  return (
    <div className="bg-green-50 border border-green-400 rounded-md shadow-sm px-2 py-1 text-center">
      <NodeLabel icon="🟢" label={data.label as ReactNode} color="text-green-600" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-green-500 rounded-full"
        isValidConnection={() => outgoingCount < 1}
      />
    </div>
  );
};

// ✅ END NODE
export const EndNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="bg-red-50 border border-red-400 rounded-md shadow-sm px-2 py-1 text-center">
      <NodeLabel icon="🔴" label={data.label as ReactNode} color="text-red-600" />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-red-500 rounded-full"
      />
    </div>
  );
};

// ✅ ACTION NODE
export const ActionNode: React.FC<NodeProps> = ({ id, data }) => {
  const edges = useStore((s) => s.edges);
  const outgoing = edges.filter((e) => e.source === id).length;
  const incoming = edges.filter((e) => e.target === id).length;

  return (
    <div className="bg-blue-50 border border-blue-400 rounded-md shadow-sm px-2 py-1 text-center">
      <NodeLabel icon="⚙️" label={data.label as ReactNode} color="text-blue-600" />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-blue-500 rounded-full"
        isValidConnection={() => incoming < 1}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-blue-500 rounded-full"
        isValidConnection={() => outgoing < 1}
      />
    </div>
  );
};

// ✅ DECISION NODE
export const DecisionNode: React.FC<NodeProps> = ({ id, data }) => {
  const edges = useStore((s) => s.edges);
  const incoming = edges.filter((e) => e.target === id).length;

  return (
    <div className="bg-yellow-50 border border-yellow-400 rounded-md shadow-sm px-2 py-1 text-center">
      <NodeLabel icon="❓" label={data.label as ReactNode} color="text-yellow-600" />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-yellow-500 rounded-full"
        isValidConnection={() => incoming < 1}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-yellow-500 rounded-full"
      />
    </div>
  );
};

// ✅ Export node types
export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  decision: DecisionNode,
};
