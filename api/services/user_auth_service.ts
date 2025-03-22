// Axios
import { apiPost } from "@/api/apiCall";
import { BR } from "@/api/BaseResponse";

// Zod
import { z } from "zod";
import { stringMandatory } from "@/api/zod/zod_utils";

// URL and Endpoints
const URL = "user/auth";

const ENDPOINTS = {
  signup: `${URL}/signup`,
  login: `${URL}/login`,
};

// Model Interface
export interface AuthUser {
  user_id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

// ✅ Signup Schema
export const SignupSchema = z.object({
  name: stringMandatory("Name", 2, 100),
  email: stringMandatory("Email"),
  password: stringMandatory("Password", 6),
});
export type SignupDTO = z.infer<typeof SignupSchema>;

// ✅ Login Schema
export const LoginSchema = z.object({
  email: stringMandatory("Email"),
  password: stringMandatory("Password", 6),
});
export type LoginDTO = z.infer<typeof LoginSchema>;

// ✅ API Methods using BR<T>
export const signup = async (data: SignupDTO): Promise<BR<AuthResponse>> => {
  return apiPost<BR<AuthResponse>, SignupDTO>(ENDPOINTS.signup, data);
};

export const login = async (data: LoginDTO): Promise<BR<AuthResponse>> => {
  return apiPost<BR<AuthResponse>, LoginDTO>(ENDPOINTS.login, data);
};
