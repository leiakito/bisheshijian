import { get, post, put, del } from "../utils/apiClient";
import type { Resident, ResidentRequest, PageResponse } from "../types/api";

/**
 * 查询住户列表（分页）
 */
export async function getResidents(params: {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<Resident>> {
  return get<PageResponse<Resident>>("/residents", {
    keyword: params.keyword,
    status: params.status,
    page: params.page,
    size: params.size || 20,
  });
}

/**
 * 创建住户
 */
export async function createResident(data: ResidentRequest): Promise<Resident> {
  return post<Resident>("/residents", data);
}

/**
 * 更新住户信息
 */
export async function updateResident(id: number, data: ResidentRequest): Promise<Resident> {
  return put<Resident>(`/residents/${id}`, data);
}

/**
 * 删除住户
 */
export async function deleteResident(id: number): Promise<void> {
  return del<void>(`/residents/${id}`);
}

export default {
  getResidents,
  createResident,
  updateResident,
  deleteResident,
};
