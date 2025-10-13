import { get, post, put, del } from "../utils/apiClient";
import type { Announcement, AnnouncementRequest, PageResponse } from "../types/api";

/**
 * 查询公告列表（分页）
 */
export async function getAnnouncements(params: {
  page?: number;
  size?: number;
}): Promise<PageResponse<Announcement>> {
  return get<PageResponse<Announcement>>("/announcements", {
    page: params.page,
    size: params.size || 20,
  });
}

/**
 * 创建公告
 */
export async function createAnnouncement(request: AnnouncementRequest): Promise<Announcement> {
  console.log("=== announcementService.createAnnouncement ===");
  console.log("请求数据:", JSON.stringify(request, null, 2));
  const result = await post<Announcement>("/announcements", request);
  console.log("响应数据:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * 获取最新公告列表
 */
export async function getLatestAnnouncements(): Promise<Announcement[]> {
  return get<Announcement[]>("/announcements");
}

/**
 * 更新公告
 */
export async function updateAnnouncement(id: number, request: AnnouncementRequest): Promise<Announcement> {
  console.log("=== announcementService.updateAnnouncement ===");
  console.log("公告ID:", id);
  console.log("请求数据:", JSON.stringify(request, null, 2));
  const result = await put<Announcement>(`/announcements/${id}`, request);
  console.log("响应数据:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * 删除公告
 */
export async function deleteAnnouncement(id: number): Promise<void> {
  console.log("=== announcementService.deleteAnnouncement ===");
  console.log("公告ID:", id);
  await del<void>(`/announcements/${id}`);
  console.log("=== 公告删除成功 ===");
}

export default {
  getAnnouncements,
  createAnnouncement,
  getLatestAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
