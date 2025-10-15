import { get, post, put } from "../utils/apiClient";
import type { RepairOrder, RepairOrderRequest, RepairStatusUpdateRequest } from "../types/api";

/**
 * 获取所有报修订单
 */
export async function getAllRepairOrders(ownerName?: string): Promise<RepairOrder[]> {
  const params = ownerName ? { ownerName } : {};
  return get<RepairOrder[]>("/repairs", params);
}

/**
 * 根据ID获取报修订单
 */
export async function getRepairOrderById(id: number): Promise<RepairOrder> {
  return get<RepairOrder>(`/repairs/${id}`);
}

/**
 * 创建报修订单
 */
export async function createRepairOrder(data: RepairOrderRequest): Promise<RepairOrder> {
  return post<RepairOrder>("/repairs", data);
}

/**
 * 更新报修订单状态
 */
export async function updateRepairOrderStatus(id: number, data: RepairStatusUpdateRequest): Promise<RepairOrder> {
  return put<RepairOrder>(`/repairs/${id}/status`, data);
}

export default {
  getAllRepairOrders,
  getRepairOrderById,
  createRepairOrder,
  updateRepairOrderStatus,
};
