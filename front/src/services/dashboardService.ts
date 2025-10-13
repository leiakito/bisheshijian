import { get } from "../utils/apiClient";
import type { DashboardSummary } from "../types/api";

/**
 * 获取仪表盘汇总数据
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return get<DashboardSummary>("/dashboard/summary");
}

export default {
  getDashboardSummary,
};
