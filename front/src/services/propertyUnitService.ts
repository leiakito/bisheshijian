import { get } from "../utils/apiClient";
import type { PropertyUnit, PageResponse } from "../types/api";

/**
 * 查询房产单元列表（分页）
 */
export async function getPropertyUnits(params: {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<PropertyUnit>> {
  return get<PageResponse<PropertyUnit>>("/property-units", {
    keyword: params.keyword,
    status: params.status,
    page: params.page,
    size: params.size || 20,
  });
}

export default {
  getPropertyUnits,
};
