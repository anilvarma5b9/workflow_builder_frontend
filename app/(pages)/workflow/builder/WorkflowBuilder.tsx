'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  MiniMap,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  ReactFlowProvider,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import DragPanel from './DragPanel';
import { nodeTypes } from './nodeTypes';
import NodeEditModal from './NodeEditModal';
import EdgeLabelModal from './EdgeLabelModal';
import WorkflowFormPanel from './WorkflowFormPanel';
import { NodeData } from './nodeTypes';
import { validateWorkflow } from './validateWorkflow';
import { WorkflowStatus } from '@/api/Enums';

import {
  createUserWorkflow,
  updateUserWorkflow,
  UserWorkflow,
  UserWorkflowDTO,
} from '@/api/services/workflow_manager_service';

import toast from 'react-hot-toast';
import { useLayout } from '@/app/LayoutContext';
import { formHandleError } from '@/app/utils/api_errors/formHandleError';
import AuthUtil from '@/app/utils/auth/AuthUtil';

interface WorkflowBuilderProps {
  initialData?: UserWorkflow;
}

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 0, y: 0 },
    data: { label: 'Start Node', description: '' },
  },
];

const initialEdges: Edge[] = [];

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ initialData }) => {
  const router = useRouter();
  const { setLoading } = useLayout();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>(
    initialData?.workflow_data?.nodes ?? initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    initialData?.workflow_data?.edges ?? initialEdges
  );

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [showEdgeModal, setShowEdgeModal] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [workflowName, setWorkflowName] = useState(initialData?.workflow_name || '');
  const [workflowDesc, setWorkflowDesc] = useState(initialData?.workflow_description || '');
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(
    initialData?.workflow_status ?? WorkflowStatus.Pending
  );
  const [validationMsg, setValidationMsg] = useState<string>('');

  const getEditingNodeData = (): NodeData | null => {
    const node = nodes.find((n) => n.id === editingNodeId);
    return node?.data || null;
  };

  useEffect(() => {
    setValidationMsg(validateWorkflow(nodes, edges));
  }, [nodes, edges]);

  const onNodeDoubleClick = useCallback((_: unknown, node: Node) => {
    setEditingNodeId(node.id);
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => {
    const { source, target } = params;
    const sourceNode = nodes.find((n) => n.id === source);
    const targetNode = nodes.find((n) => n.id === target);

    const outgoingCount = edges.filter((e) => e.source === source).length;
    const incomingCount = edges.filter((e) => e.target === target).length;

    if (sourceNode?.type === 'start' && outgoingCount >= 1) return;
    if (sourceNode?.type === 'action' && outgoingCount >= 1) return;
    if (sourceNode?.type === 'decision') {
      setPendingConnection(params as Connection);
      setShowEdgeModal(true);
      return;
    }

    if (targetNode?.type === 'action' && incomingCount >= 1) return;
    if (targetNode?.type === 'decision' && incomingCount >= 1) return;

    setEdges((eds) => addEdge(params, eds));
  }, [nodes, edges]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node<NodeData> = {
      id: `${+new Date()}`,
      type,
      position,
      data: { label: `${type} node`, description: '' },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance]);

  const handleSaveWorkflow = async (data: {
    workflow_name: string;
    workflow_description?: string;
    workflow_status: WorkflowStatus;
  }) => {
    const validation = validateWorkflow(nodes, edges);
    if (validation !== 'Valid') {
      toast.error('Validation failed: ' + validation);
      return;
    }

    const payload: UserWorkflowDTO = {
      user_id: Number(AuthUtil.getUserId()),
      workflow_name: data.workflow_name,
      workflow_description: data.workflow_description || '',
      workflow_status: data.workflow_status,
      nodes_count: nodes.length,
      edges_count: edges.length,
      workflow_data: { nodes, edges },
    };

    try {
      setLoading(true);

      const response = initialData
        ? await updateUserWorkflow(initialData.workflow_id.toString(), payload)
        : await createUserWorkflow(payload);

      if (response.status) {
        toast.success(response.message || 'Workflow saved');
        router.push('/workflow/list');
      } else {
        toast.error(response.message || 'Save failed');
      }
    } catch (error) {
      formHandleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setWorkflowName('');
    setWorkflowDesc('');
    setWorkflowStatus(WorkflowStatus.Pending);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full">
        <DragPanel />
        <div className="flex-1 relative">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onNodeDoubleClick={onNodeDoubleClick}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        <WorkflowFormPanel
          defaultValues={{
            workflow_name: workflowName,
            workflow_description: workflowDesc,
            workflow_status: workflowStatus,
          }}
          validationMsg={validationMsg}
          onSave={(data) => {
            setWorkflowName(data.workflow_name);
            setWorkflowDesc(data.workflow_description || '');
            setWorkflowStatus(data.workflow_status);
            handleSaveWorkflow(data);
          }}
          onClear={handleClearWorkflow}
        />
      </div>

      <NodeEditModal
        open={!!editingNodeId}
        initialLabel={getEditingNodeData()?.label || ''}
        initialDescription={getEditingNodeData()?.description || ''}
        onClose={() => setEditingNodeId(null)}
        onSave={(label, description) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === editingNodeId ? { ...n, data: { ...n.data, label, description } } : n
            )
          );
          setEditingNodeId(null);
        }}
      />

      <EdgeLabelModal
        open={showEdgeModal}
        onClose={() => {
          setPendingConnection(null);
          setShowEdgeModal(false);
        }}
        onSave={(label) => {
          if (pendingConnection) {
            setEdges((eds) =>
              addEdge(
                {
                  ...pendingConnection,
                  label,
                  style: { strokeWidth: 2 },
                  labelStyle: {
                    fontWeight: 600,
                    fill: '#333',
                    fontSize: 12,
                  },
                },
                eds
              )
            );
          }
          setPendingConnection(null);
          setShowEdgeModal(false);
        }}
      />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
