import { get, post, put, del } from "../utils/apiClient";
import type { Facility, FacilityRequest } from "../types/api";

/**
 * 获取所有设施列表
 */
export async function getFacilities(): Promise<Facility[]> {
  return get<Facility[]>("/facilities");
}

/**
 * 根据ID获取设施详情
 */
export async function getFacilityById(id: number): Promise<Facility> {
  return get<Facility>(`/facilities/${id}`);
}

/**
 * 创建设施
 */
export async function createFacility(request: FacilityRequest): Promise<Facility> {
  console.log("=== facilityService.createFacility ===");
  console.log("请求数据:", JSON.stringify(request, null, 2));
  const result = await post<Facility>("/facilities", request);
  console.log("响应数据:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * 更新设施
 */
export async function updateFacility(id: number, request: FacilityRequest): Promise<Facility> {
  console.log("=== facilityService.updateFacility ===");
  console.log("设施ID:", id);
  console.log("请求数据:", JSON.stringify(request, null, 2));
  const result = await put<Facility>(`/facilities/${id}`, request);
  console.log("响应数据:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * 删除设施
 */
export async function deleteFacility(id: number): Promise<void> {
  console.log("=== facilityService.deleteFacility ===");
  console.log("设施ID:", id);
  await del<void>(`/facilities/${id}`);
  console.log("=== 设施删除成功 ===");
}

export default {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
