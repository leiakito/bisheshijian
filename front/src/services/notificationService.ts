import { getLatestAnnouncements } from "./announcementService";
import { getAllComplaints } from "./complaintService";
import type { Notification, Announcement, Complaint } from "../types/api";
import { Bell, CheckCircle } from "lucide-react";

/**
 * 格式化时间差
 */
function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "未知时间";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;

  return date.toLocaleDateString('zh-CN');
}

/**
 * 将公告转换为通知
 */
function announcementToNotification(announcement: Announcement): Notification {
  return {
    id: `announcement-${announcement.id}`,
    type: 'announcement',
    title: `新公告：${announcement.title}`,
    content: announcement.content,
    time: formatTimeAgo(announcement.publishAt),
    read: false,
    icon: Bell,
    color: "text-blue-600",
    bg: "bg-blue-100",
    sourceId: announcement.id,
  };
}

/**
 * 将已完成的投诉转换为通知
 */
function complaintToNotification(complaint: Complaint): Notification {
  return {
    id: `complaint-${complaint.id}`,
    type: 'complaint',
    title: `投诉已处理完成`,
    content: `您的投诉"${complaint.type}"已处理完成。处理人：${complaint.processedBy || '未知'}${complaint.reply ? `，回复：${complaint.reply}` : ''}`,
    time: formatTimeAgo(complaint.updatedAt),
    read: false,
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    sourceId: complaint.id,
  };
}

/**
 * 获取所有通知
 */
export async function getAllNotifications(): Promise<Notification[]> {
  try {
    // 并行获取公告和投诉数据
    const [announcements, complaints] = await Promise.all([
      getLatestAnnouncements(),
      getAllComplaints(),
    ]);

    // 将公告转换为通知
    const announcementNotifications = announcements.map(announcementToNotification);

    // 只将已完成的投诉转换为通知
    const complaintNotifications = complaints
      .filter(c => c.status === 'COMPLETED')
      .map(complaintToNotification);

    // 合并所有通知
    const allNotifications = [...announcementNotifications, ...complaintNotifications];

    // 按时间排序（最新的在前）
    allNotifications.sort((a, b) => {
      // 简单的字符串比较，实际使用中可能需要更复杂的逻辑
      return b.time.localeCompare(a.time);
    });

    return allNotifications;
  } catch (error) {
    console.error("获取通知失败:", error);
    throw error;
  }
}

export default {
  getAllNotifications,
};
