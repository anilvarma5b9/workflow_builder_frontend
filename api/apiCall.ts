import axios_instance from "@/api/axios_instance";

export const apiGet = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> => {
  const response = await axios_instance.get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T, D>(url: string, data: D): Promise<T> => {
  const response = await axios_instance.post<T>(url, data);
  return response.data;
};

export const apiPatch = async <T, D>(url: string, data: D): Promise<T> => {
  const response = await axios_instance.patch<T>(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await axios_instance.delete<T>(url);
  return response.data;
};
