import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import AuthUtil from "../app/utils/auth/AuthUtil";

// Create axios instance
const axios_instance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || "",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Authorization Interceptor
axios_instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AuthUtil.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers) {
      config.headers["X-API-KEY"] = process.env.X_API_KEY;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

// Attach Error Handler Interceptor
axios_instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.log("API Error:", error.response || error.message);
    // Handle specific status codes if necessary
    if (error.response?.status === 401) {
      console.log("Unauthorized access - redirecting to login...");
      // Handle token refresh or logout logic if necessary
    } else if (error.response?.status === 403) {
      console.log("Access forbidden - insufficient permissions.");
    } else if (error.response?.status === 500) {
      console.log("Server error - something went wrong on the backend.");
    }
    return Promise.reject(error);
  }
);

export default axios_instance;
