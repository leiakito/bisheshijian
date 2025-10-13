import { get, post, put, del } from "../utils/apiClient";
import type { ParkingSpace, ParkingSpaceRequest } from "../types/api";

/**
 * 获取所有停车位列表
 */
export async function getParkingSpaces(): Promise<ParkingSpace[]> {
  return get<ParkingSpace[]>("/parking-spaces");
}

/**
 * 根据ID获取停车位详情
 */
export async function getParkingSpaceById(id: number): Promise<ParkingSpace> {
  return get<ParkingSpace>(`/parking-spaces/${id}`);
}

/**
 * 创建停车位
 */
export async function createParkingSpace(request: ParkingSpaceRequest): Promise<ParkingSpace> {
  console.log("=== parkingSpaceService.createParkingSpace ===");
  console.log("请求数据:", JSON.stringify(request, null, 2));
  const result = await post<ParkingSpace>("/parking-spaces", request);
  console.log("响应数据:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * 更新停车位
 */
export async function updateParkingSpace(id: number, request: ParkingSpaceRequest): Promise<ParkingSpace> {
  console.log("=== parkingSpaceService.updateParkingSpace ===");
  console.log("停车位ID:", id);
  console.log("请求数据:", JSON.stringify(request, null, 2));
  const result = await put<ParkingSpace>(`/parking-spaces/${id}`, request);
  console.log("响应数据:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * 删除停车位
 */
export async function deleteParkingSpace(id: number): Promise<void> {
  console.log("=== parkingSpaceService.deleteParkingSpace ===");
  console.log("停车位ID:", id);
  await del<void>(`/parking-spaces/${id}`);
  console.log("=== 停车位删除成功 ===");
}

export default {
  getParkingSpaces,
  getParkingSpaceById,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
};
