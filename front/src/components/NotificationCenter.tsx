import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Bell,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Trash2,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAllNotifications } from "../services/notificationService";
import type { Notification } from "../types/api";
import { toast } from "sonner";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载通知数据
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("加载通知失败:", error);
      toast.error("加载通知失败");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* 顶部统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">全部通知</p>
              <h3 className="text-gray-900">{notifications.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">未读通知</p>
              <h3 className="text-gray-900">{unreadCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">已读通知</p>
              <h3 className="text-gray-900">
                {notifications.length - unreadCount}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* 通知列表 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">通知中心</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || loading}
          >
            <Check className="w-4 h-4 mr-2" />
            全部已读
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">加载中...</div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-500">暂无通知</div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                全部 ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">未读 ({unreadCount})</TabsTrigger>
              <TabsTrigger value="announcement">公告通知</TabsTrigger>
              <TabsTrigger value="complaint">投诉处理</TabsTrigger>
            </TabsList>

          <TabsContent value="all">
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      notification.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className={`${notification.bg} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-gray-900">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="default" className="ml-2">
                            新
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              标记已读
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="space-y-3">
              {notifications
                .filter((n) => !n.read)
                .map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-blue-50 border-blue-200"
                    >
                      <div className={`${notification.bg} p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-gray-900">
                            {notification.title}
                          </h4>
                          <Badge variant="default" className="ml-2">
                            新
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {notification.time}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              标记已读
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {notifications.filter((n) => !n.read).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  没有未读通知
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="announcement">
            <div className="space-y-3">
              {notifications
                .filter((n) => n.type === "announcement")
                .map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        notification.read
                          ? "bg-white border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className={`${notification.bg} p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">
                              新
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {notification.time}
                          </span>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                标记已读
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {notifications.filter((n) => n.type === "announcement").length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  暂无公告通知
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="complaint">
            <div className="space-y-3">
              {notifications
                .filter((n) => n.type === "complaint")
                .map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        notification.read
                          ? "bg-white border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className={`${notification.bg} p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">
                              新
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {notification.time}
                          </span>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                标记已读
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {notifications.filter((n) => n.type === "complaint").length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  暂无投诉处理通知
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        )}
      </Card>
    </div>
  );
}
