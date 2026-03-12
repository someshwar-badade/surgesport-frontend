import axios, { AxiosError, type AxiosResponse } from "axios";
import type {AxiosInstance, InternalAxiosRequestConfig} from "axios";
interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
    [key: string]: any;
}

const apiClient: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>): Promise<AxiosError> => {
        const status = error.response?.status;
        const url = error.config?.url;

        // Check if it's a 401 error and not from login endpoint
        if (status === 401 && url && !url.includes("/login")) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;