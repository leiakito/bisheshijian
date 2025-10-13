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
import { useState } from "react";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "system",
      title: "系统更新通知",
      content: "系统将于今晚22:00-23:00进行维护升级，期间可能影响使用。",
      time: "10分钟前",
      read: false,
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: "2",
      type: "repair",
      title: "新报修工单",
      content: "1号楼2单元301 提交了水管漏水报修申请，请及时处理。",
      time: "1小时前",
      read: false,
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: "3",
      type: "payment",
      title: "缴费成功",
      content: "张三已成功缴纳2025年1月物业费，金额：¥2,400。",
      time: "2小时前",
      read: false,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      id: "4",
      type: "message",
      title: "收到新投诉",
      content: "业主反馈小区垃圾桶未及时清理，请相关人员关注。",
      time: "3小时前",
      read: true,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: "5",
      type: "system",
      title: "账单生成完成",
      content: "2025年1月物业费账单已全部生成，共1268户。",
      time: "1天前",
      read: true,
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]);

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
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            全部已读
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              全部 ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">未读 ({unreadCount})</TabsTrigger>
            <TabsTrigger value="system">系统通知</TabsTrigger>
            <TabsTrigger value="repair">报修通知</TabsTrigger>
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

          <TabsContent value="system">
            <div className="space-y-3">
              {notifications
                .filter((n) => n.type === "system")
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
                        <h4 className="text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.content}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="repair">
            <div className="space-y-3">
              {notifications
                .filter((n) => n.type === "repair")
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
                        <h4 className="text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.content}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
