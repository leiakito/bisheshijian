import { get, post, put } from "../utils/apiClient";
import type { Complaint, ComplaintRequest } from "../types/api";

export interface ComplaintUpdateRequest {
  status: string;
  processedBy?: string;
  reply?: string;
}

/**
 * 获取所有投诉记录
 */
export async function getAllComplaints(ownerName?: string): Promise<Complaint[]> {
  const params = ownerName ? { ownerName } : {};
  return get<Complaint[]>("/complaints", params);
}

/**
 * 根据ID获取投诉
 */
export async function getComplaintById(id: number): Promise<Complaint> {
  return get<Complaint>(`/complaints/${id}`);
}

/**
 * 创建投诉
 */
export async function createComplaint(data: ComplaintRequest): Promise<Complaint> {
  return post<Complaint>("/complaints", data);
}

/**
 * 更新投诉状态
 */
export async function updateComplaintStatus(id: number, data: ComplaintUpdateRequest): Promise<Complaint> {
  return put<Complaint>(`/complaints/${id}/status`, data);
}

export default {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
};
