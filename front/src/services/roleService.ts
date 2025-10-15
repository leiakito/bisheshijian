import { get, post, put, del } from "../utils/apiClient";
import type { RoleResponse, RoleRequest } from "../types/api";

/**
 * 获取所有角色列表
 */
export async function getAllRoles(): Promise<RoleResponse[]> {
  return get<RoleResponse[]>("/roles");
}

/**
 * 根据ID获取角色详情
 */
export async function getRoleById(id: number): Promise<RoleResponse> {
  return get<RoleResponse>(`/roles/${id}`);
}

/**
 * 创建角色
 */
export async function createRole(data: RoleRequest): Promise<RoleResponse> {
  return post<RoleResponse>("/roles", data);
}

/**
 * 更新角色
 */
export async function updateRole(id: number, data: RoleRequest): Promise<RoleResponse> {
  return put<RoleResponse>(`/roles/${id}`, data);
}

/**
 * 删除角色
 */
export async function deleteRole(id: number): Promise<void> {
  return del<void>(`/roles/${id}`);
}

export default {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
