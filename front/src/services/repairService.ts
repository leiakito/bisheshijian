import { get, post, put } from "../utils/apiClient";
import type { RepairOrder, RepairOrderRequest, RepairStatusUpdateRequest, PageResponse } from "../types/api";

/**
 * 查询报修工单列表（分页）
 */
export async function getRepairs(params: {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<RepairOrder>> {
  return get<PageResponse<RepairOrder>>("/repairs", {
    keyword: params.keyword,
    status: params.status,
    page: params.page,
    size: params.size || 20,
  });
}

/**
 * 创建报修工单
 */
export async function createRepair(data: RepairOrderRequest): Promise<RepairOrder> {
  return post<RepairOrder>("/repairs", data);
}

/**
 * 更新报修工单状态
 */
export async function updateRepairStatus(id: number, data: RepairStatusUpdateRequest): Promise<RepairOrder> {
  return put<RepairOrder>(`/repairs/${id}/status`, data);
}

export default {
  getRepairs,
  createRepair,
  updateRepairStatus,
};
