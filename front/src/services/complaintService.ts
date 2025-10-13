import { get, post } from "../utils/apiClient";
import type { Complaint, ComplaintRequest, PageResponse } from "../types/api";

/**
 * 查询投诉列表（分页）
 */
export async function getComplaints(params: {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<Complaint>> {
  return get<PageResponse<Complaint>>("/complaints", {
    keyword: params.keyword,
    status: params.status,
    page: params.page,
    size: params.size || 20,
  });
}

/**
 * 创建投诉
 */
export async function createComplaint(data: ComplaintRequest): Promise<Complaint> {
  return post<Complaint>("/complaints", data);
}

export default {
  getComplaints,
  createComplaint,
};
