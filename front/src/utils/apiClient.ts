import type { ApiResponse } from "../types/api";
import { getToken, clearAuth, isTokenExpired } from "./tokenManager";

// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// API 请求配置
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// 构建查询字符串
function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// 通用 API 请求函数
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, headers, ...restConfig } = config;

  // 构建完整 URL
  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;

  // 构建请求头
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 添加 Authorization header（如果有 token）
  const token = getToken();
  if (token) {
    // 检查token是否过期
    if (isTokenExpired(token)) {
      clearAuth();
      window.location.href = "/";
      throw new Error("登录已过期，请重新登录");
    }
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...restConfig,
      headers: requestHeaders,
    });

    // 处理 401 未授权错误
    if (response.status === 401) {
      clearAuth();
      window.location.href = "/";
      throw new Error("未授权，请重新登录");
    }

    // 处理其他 HTTP 错误
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`请求失败: ${response.status} ${errorText}`);
    }

    // 解析响应
    const data = await response.json();

    // 处理包装的 ApiResponse
    if (data && typeof data === "object" && "success" in data) {
      const apiResponse = data as ApiResponse<T>;
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "请求失败");
      }
      return apiResponse.data;
    }

    return data as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// GET 请求
export function get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  return request<T>(endpoint, { method: "GET", params });
}

// POST 请求
export function post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });
}

// PUT 请求
export function put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });
}

// DELETE 请求
export function del<T>(endpoint: string, config?: RequestConfig): Promise<T> {
  return request<T>(endpoint, {
    method: "DELETE",
    ...config,
  });
}

export default {
  get,
  post,
  put,
  delete: del,
};
