import { get, post } from "../utils/apiClient";
import type { Complaint, ComplaintRequest } from "../types/api";

/**
 * 查询所有投诉列表
 */
export async function getAllComplaints(): Promise<Complaint[]> {
  return get<Complaint[]>("/complaints");
}

/**
 * 创建投诉
 */
export async function createComplaint(data: ComplaintRequest): Promise<Complaint> {
  return post<Complaint>("/complaints", data);
}

export default {
  getAllComplaints,
  createComplaint,
};
