import { get, post } from "../utils/apiClient";
import { saveToken, clearAuth } from "../utils/tokenManager";
import type { LoginRequest, LoginResponse } from "../types/api";

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>("/auth/login", credentials);

  // 登录成功后保存 token 和用户信息
  if (response.token) {
    saveToken(response.token, {
      username: response.username,
      displayName: response.displayName,
      roles: response.roles,
    });
  }

  return response;
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<{
  username: string;
  fullName: string;
  phone: string;
  email: string;
  resident?: {
    id: number;
    name: string;
    phone: string;
    building: string;
    unit: string;
    roomNumber: string;
    area: string;
    status: string;
  };
}> {
  return get("/auth/me");
}

/**
 * 用户登出
 */
export function logout(): void {
  clearAuth();
}

export default {
  login,
  getCurrentUser,
  logout,
};
