import { Node, Edge } from "@xyflow/react";
import { NodeData } from "./nodeTypes";

export function validateWorkflow(
  nodes: Node<NodeData>[],
  edges: Edge[]
): string {
  const startNodes = nodes.filter((n) => n.type === "start");
  const endNodes = nodes.filter((n) => n.type === "end");
  const actionNodes = nodes.filter((n) => n.type === "action");
  const decisionNodes = nodes.filter((n) => n.type === "decision");

  // Rule 1: Exactly one start node
  if (startNodes.length !== 1) {
    return "There must be exactly one Start node.";
  }

  const startNode = startNodes[0];
  const startOutgoing = edges.filter((e) => e.source === startNode.id);
  if (startOutgoing.length === 0) {
    return "Start node must have at least one outgoing connection.";
  }

  // Rule 2: Action nodes must have exactly 1 in and 1 out
  for (const node of actionNodes) {
    const inCount = edges.filter((e) => e.target === node.id).length;
    const outCount = edges.filter((e) => e.source === node.id).length;
    if (inCount < 1 || outCount < 1) {
      return `Action node "${node.data.label}" must have both incoming and outgoing connections.`;
    }
  }

  // Rule 3: Decision nodes must have 1 incoming and at least 1 outgoing
  for (const node of decisionNodes) {
    const inCount = edges.filter((e) => e.target === node.id).length;
    const outCount = edges.filter((e) => e.source === node.id).length;
    if (inCount < 1) {
      return `Decision node "${node.data.label}" must have at least one incoming connection.`;
    }
    if (outCount < 1) {
      return `Decision node "${node.data.label}" must have at least one outgoing connection.`;
    }
  }

  // Rule 4: End nodes must have at least one incoming connection
  for (const node of endNodes) {
    const inCount = edges.filter((e) => e.target === node.id).length;
    if (inCount < 1) {
      return `End node "${node.data.label}" must have at least one incoming connection.`;
    }
  }

  return "Valid";
}
