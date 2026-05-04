import axios from "axios";
import { ApiResponse } from "@/types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 — Access Token 자동 첨부
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터 — 공통 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost/api"}/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
