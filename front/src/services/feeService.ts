import { get, post, put, del } from "../utils/apiClient";
import type {
  Bill,
  BillRequest,
  Payment,
  PaymentRequest,
  FeeItem,
  FeeItemRequest,
  FeeStatistics,
  GenerateBillsRequest
} from "../types/api";

// ========== 账单管理 ==========

/**
 * 获取所有账单
 */
export async function getAllBills(ownerName?: string): Promise<Bill[]> {
  const params = ownerName ? { ownerName } : {};
  return get<Bill[]>("/fees/bills", params);
}

/**
 * 根据ID获取账单
 */
export async function getBillById(id: number): Promise<Bill> {
  return get<Bill>(`/fees/bills/${id}`);
}

/**
 * 创建账单
 */
export async function createBill(data: BillRequest): Promise<Bill> {
  return post<Bill>("/fees/bills", data);
}

// ========== 缴费记录 ==========

/**
 * 获取所有缴费记录
 */
export async function getAllPayments(): Promise<Payment[]> {
  return get<Payment[]>("/fees/payments");
}

/**
 * 创建缴费记录（记录缴费）
 */
export async function createPayment(data: PaymentRequest): Promise<Payment> {
  return post<Payment>("/fees/payments", data);
}

// ========== 收费项目 ==========

/**
 * 获取所有收费项目
 */
export async function getAllFeeItems(): Promise<FeeItem[]> {
  return get<FeeItem[]>("/fees/items");
}

/**
 * 根据ID获取收费项目
 */
export async function getFeeItemById(id: number): Promise<FeeItem> {
  return get<FeeItem>(`/fees/items/${id}`);
}

/**
 * 创建收费项目
 */
export async function createFeeItem(data: FeeItemRequest): Promise<FeeItem> {
  return post<FeeItem>("/fees/items", data);
}

/**
 * 更新收费项目
 */
export async function updateFeeItem(id: number, data: FeeItemRequest): Promise<FeeItem> {
  return put<FeeItem>(`/fees/items/${id}`, data);
}

/**
 * 删除收费项目
 */
export async function deleteFeeItem(id: number): Promise<void> {
  return del<void>(`/fees/items/${id}`);
}

/**
 * 切换收费项目状态（启用/停用）
 */
export async function toggleFeeItemStatus(id: number): Promise<FeeItem> {
  return put<FeeItem>(`/fees/items/${id}/toggle-status`, {});
}

/**
 * 为指定收费项目批量生成账单
 */
export async function generateBillsFromFeeItem(id: number, data: GenerateBillsRequest): Promise<Bill[]> {
  return post<Bill[]>(`/fees/items/${id}/generate-bills`, data);
}

// ========== 统计 ==========

/**
 * 获取财务统计数据
 */
export async function getStatistics(): Promise<FeeStatistics> {
  return get<FeeStatistics>("/fees/statistics");
}

export default {
  getAllBills,
  getBillById,
  createBill,
  getAllPayments,
  createPayment,
  getAllFeeItems,
  getFeeItemById,
  createFeeItem,
  updateFeeItem,
  deleteFeeItem,
  toggleFeeItemStatus,
  generateBillsFromFeeItem,
  getStatistics,
};
