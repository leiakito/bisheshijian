import { get, post, put, del } from "../utils/apiClient";
import type { UserResponse, UserRequest, PageResponse, Role } from "../types/api";

/**
 * 获取用户列表（分页）
 */
export async function getUsers(params: {
  page?: number;
  size?: number;
}): Promise<PageResponse<UserResponse>> {
  return get<PageResponse<UserResponse>>("/users", {
    page: params.page,
    size: params.size || 20,
  });
}

/**
 * 创建用户
 */
export async function createUser(data: UserRequest): Promise<UserResponse> {
  return post<UserResponse>("/users", data);
}

/**
 * 更新用户信息
 */
export async function updateUser(id: number, data: UserRequest): Promise<UserResponse> {
  return put<UserResponse>(`/users/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<void> {
  return del<void>(`/users/${id}`);
}

/**
 * 切换用户状态
 */
export async function toggleUserStatus(id: number): Promise<UserResponse> {
  return put<UserResponse>(`/users/${id}/toggle-status`, {});
}

/**
 * 获取可用的角色列表（排除管理员）
 */
export async function getAvailableRoles(): Promise<Role[]> {
  return get<Role[]>("/roles/available");
}

/**
 * 重置用户密码
 */
export async function resetUserPassword(userId: number, newPassword: string): Promise<void> {
  return put<void>(`/users/${userId}/reset-password`, { newPassword });
}

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getAvailableRoles,
  resetUserPassword,
};
