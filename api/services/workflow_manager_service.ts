// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from "@/api/apiCall";
import { BR } from "@/api/BaseResponse";

// Zod
import { z } from "zod";
import {
  enumMandatory,
  multi_select_optional,
  numberMandatory,
  numberOptional,
  stringMandatory,
  stringOptional,
} from "@/api/zod/zod_utils";

// Enums
import { WorkflowStatus } from "@/api/Enums";

// URL and Endpoints
const URL = "user-workflows";

const ENDPOINTS = {
  find: `${URL}`,
  findByUser: (userId: string): string => `${URL}/user/${userId}`,
  findById: (id: string): string => `${URL}/${id}`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Model Interface
export interface UserWorkflow extends Record<string, unknown> {
  workflow_id: number;
  user_id: number;
  workflow_name: string;
  workflow_description: string;
  workflow_status: WorkflowStatus;
  nodes_count: number;
  edges_count: number;
  workflow_data?: unknown;
  createdAt: string;
  updatedAt: string;
}

// Zod Schemas
// ✅ Create/Update Schema
export const UserWorkflowSchema = z.object({
  user_id: numberMandatory("User"),
  workflow_name: stringMandatory("Workflow Name", 2, 100),
  workflow_description: stringOptional("Workflow Description"),
  workflow_status: enumMandatory(
    "Workflow Status",
    WorkflowStatus,
    WorkflowStatus.Pending
  ),
  nodes_count: numberOptional("Nodes Count"),
  edges_count: numberOptional("Edges Count"),
  workflow_data: z.any(),
});
export type UserWorkflowDTO = z.infer<typeof UserWorkflowSchema>;

// ✅ Partial Update Schema
export const UpdateUserWorkflowSchema = UserWorkflowSchema.partial();
export type UpdateUserWorkflowDTO = z.infer<typeof UpdateUserWorkflowSchema>;

// ✅ Query Schema
export const UserWorkflowQuerySchema = z.object({
  search: stringOptional("Search", 0, 100),
  status: multi_select_optional("WorkflowStatus"),
});
export type UserWorkflowQueryDTO = z.infer<typeof UserWorkflowQuerySchema>;

// Payload Conversions
export const toUserWorkflowPayload = (
  workflow: UserWorkflow
): UserWorkflowDTO => ({
  user_id: workflow.user_id,
  workflow_name: workflow.workflow_name,
  workflow_description: workflow.workflow_description,
  workflow_status: workflow.workflow_status,
  nodes_count: workflow.nodes_count,
  edges_count: workflow.edges_count,
  workflow_data: workflow.workflow_data,
});

export const newUserWorkflowPayload = (): UserWorkflowDTO => ({
  user_id: 0,
  workflow_name: "",
  workflow_description: "",
  workflow_status: WorkflowStatus.Pending,
  nodes_count: 0,
  edges_count: 0,
  workflow_data: {},
});

// API Methods
export const findUserWorkflows = async (params: {
  search?: string;
  status?: string;
}): Promise<BR<UserWorkflow[]>> => {
  return apiGet<BR<UserWorkflow[]>>(ENDPOINTS.find, params);
};

export const findUserWorkflowsByUser = async (
  userId: string,
  params?: { search?: string; status?: string }
): Promise<BR<UserWorkflow[]>> => {
  return apiGet<BR<UserWorkflow[]>>(ENDPOINTS.findByUser(userId), params);
};

export const findUserWorkflowById = async (
  id: string
): Promise<BR<UserWorkflow>> => {
  return apiGet<BR<UserWorkflow>>(ENDPOINTS.findById(id));
};

export const createUserWorkflow = async (
  data: UserWorkflowDTO
): Promise<BR<UserWorkflow>> => {
  return apiPost<BR<UserWorkflow>, UserWorkflowDTO>(ENDPOINTS.create, data);
};

export const updateUserWorkflow = async (
  id: string,
  data: UpdateUserWorkflowDTO
): Promise<BR<UserWorkflow>> => {
  return apiPatch<BR<UserWorkflow>, UpdateUserWorkflowDTO>(
    ENDPOINTS.update(id),
    data
  );
};

export const deleteUserWorkflow = async (
  id: string
): Promise<BR<UserWorkflow>> => {
  return apiDelete<BR<UserWorkflow>>(ENDPOINTS.delete(id));
};
