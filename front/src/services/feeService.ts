import { get } from "../utils/apiClient";
import type { FeeBill, PageResponse } from "../types/api";

/**
 * 查询账单列表（分页）
 */
export async function getFeeBills(params: {
  keyword?: string;
  status?: string;
  billType?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<FeeBill>> {
  return get<PageResponse<FeeBill>>("/fees/bills", {
    keyword: params.keyword,
    status: params.status,
    billType: params.billType,
    page: params.page,
    size: params.size || 20,
  });
}

export default {
  getFeeBills,
};
