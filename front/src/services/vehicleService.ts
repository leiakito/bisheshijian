import { get } from "../utils/apiClient";
import type { Vehicle, PageResponse } from "../types/api";

/**
 * 查询车辆列表（分页）
 */
export async function getVehicles(params: {
  keyword?: string;
  vehicleType?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<Vehicle>> {
  return get<PageResponse<Vehicle>>("/vehicles", {
    keyword: params.keyword,
    vehicleType: params.vehicleType,
    page: params.page,
    size: params.size || 20,
  });
}

export default {
  getVehicles,
};
