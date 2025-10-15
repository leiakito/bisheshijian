import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  Star,
  LogOut,
} from "lucide-react";
import { clearMaintenanceSession } from "../utils/sessionManager";
import { getUserInfo } from "../utils/tokenManager";
import { getAllRepairOrders, updateRepairOrderStatus } from "../services/repairService";
import type { RepairOrder } from "../types/api";
import { toast } from "sonner";

type MaintenanceStatus = "pending" | "processing" | "completed";

const STATUS_LABELS: Record<RepairOrder["status"], string> = {
  PENDING: "待接单",
  IN_PROGRESS: "处理中",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
};

const STATUS_VARIANT: Record<RepairOrder["status"], "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline",
  IN_PROGRESS: "secondary",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

const STATUS_ICON: Record<RepairOrder["status"], typeof AlertCircle> = {
  PENDING: AlertCircle,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
  CANCELLED: AlertCircle,
};

const PRIORITY_LABELS: Record<NonNullable<RepairOrder["priority"]>, string> = {
  NORMAL: "普通",
  URGENT: "紧急",
};

const PRIORITY_VARIANT: Record<NonNullable<RepairOrder["priority"]>, "secondary" | "destructive"> = {
  NORMAL: "secondary",
  URGENT: "destructive",
};

const STATUS_ROUTE_MAP: Record<MaintenanceStatus, RepairOrder["status"]> = {
  pending: "PENDING",
  processing: "IN_PROGRESS",
  completed: "COMPLETED",
};

const ROUTE_STATUS_MAP: Record<RepairOrder["status"], MaintenanceStatus | null> = {
  PENDING: "pending",
  IN_PROGRESS: "processing",
  COMPLETED: "completed",
  CANCELLED: "pending",
};

function getValidStatus(status?: string): MaintenanceStatus {
  if (status === "processing" || status === "completed") {
    return status;
  }
  return "pending";
}

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("zh-CN", {
    hour12: false,
  });
}

function isToday(value?: string | null): boolean {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function MaintenancePortalLayout() {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const workerName = userInfo?.displayName || userInfo?.username || "维修师傅";

  const handleLogout = () => {
    clearMaintenanceSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-orange-600 text-white">
                  {workerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-gray-900">{workerName}</h2>
                <p className="text-sm text-gray-500">维修师傅</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export function MaintenanceOrdersPage() {
  const navigate = useNavigate();
  const { status: statusParam, orderId } = useParams();
  const status = getValidStatus(statusParam);
  const location = useLocation();
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionOrderId, setActionOrderId] = useState<number | null>(null);
  const userInfo = getUserInfo();
  const workerName = userInfo?.displayName || userInfo?.username || "维修师傅";

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllRepairOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load repair orders:", error);
      toast.error("加载维修工单失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const backendStatus = STATUS_ROUTE_MAP[status];
    return orders.filter((order) => order.status === backendStatus);
  }, [orders, status]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const processing = orders.filter((o) => o.status === "IN_PROGRESS").length;
    const completed = orders.filter((o) => o.status === "COMPLETED").length;
    const todayCompleted = orders.filter(
      (o) => o.status === "COMPLETED" && isToday(o.finishedAt),
    ).length;
    return { pending, processing, completed, todayCompleted };
  }, [orders]);

  const currentOrder = useMemo(() => {
    if (!orderId) return null;
    const numericId = Number(orderId);
    if (!Number.isNaN(numericId)) {
      const byId = orders.find((order) => order.id === numericId);
      if (byId) return byId;
    }
    return orders.find((order) => order.orderNumber === orderId) || null;
  }, [orderId, orders]);

  const isDialogOpen = Boolean(orderId);

  const handleTabChange = (nextStatus: string) => {
    const valid = getValidStatus(nextStatus);
    navigate(`/maintenance/orders/${valid}`, { replace: true });
  };

  const handleViewDetail = (order: RepairOrder) => {
    const routeStatus = ROUTE_STATUS_MAP[order.status];
    const targetStatus = routeStatus ?? "pending";
    navigate(`/maintenance/orders/${targetStatus}/${order.id}`);
  };

  const handleDialogChange = (open: boolean) => {
    if (open && currentOrder) {
      navigate(`/maintenance/orders/${status}/${currentOrder.id}`, {
        replace: true,
      });
    } else {
      navigate(`/maintenance/orders/${status}`, {
        replace: true,
        state: { from: location.state },
      });
    }
  };

  const handleStatusUpdate = useCallback(
    async (order: RepairOrder, nextStatus: RepairOrder["status"], successMessage: string) => {
      try {
        setActionOrderId(order.id);
        const updated = await updateRepairOrderStatus(order.id, {
          status: nextStatus,
          assignedWorker: workerName,
        });
        toast.success(successMessage);
        await fetchOrders();
        const routeStatus = ROUTE_STATUS_MAP[updated.status] ?? "pending";
        navigate(`/maintenance/orders/${routeStatus}`, { replace: true });
      } catch (error) {
        console.error("Failed to update order status:", error);
        toast.error("操作失败，请稍后重试");
      } finally {
        setActionOrderId(null);
      }
    },
    [fetchOrders, navigate, workerName],
  );

  const handleAccept = (order: RepairOrder) => {
    void handleStatusUpdate(order, "IN_PROGRESS", "已接单，开始处理");
  };

  const handleComplete = (order: RepairOrder) => {
    void handleStatusUpdate(order, "COMPLETED", "工单已完成");
  };

  const renderOrderCard = (order: RepairOrder) => {
    const statusLabel = STATUS_LABELS[order.status] ?? order.status;
    const StatusIcon = STATUS_ICON[order.status] ?? AlertCircle;
    const statusVariant = STATUS_VARIANT[order.status] ?? "outline";
    const priorityLabel = order.priority ? PRIORITY_LABELS[order.priority] ?? order.priority : "普通";
    const priorityVariant = order.priority ? PRIORITY_VARIANT[order.priority] ?? "secondary" : "secondary";
    const rating = order.evaluationScore ?? 0;
    const description = order.description || "暂无描述";

    return (
      <Card
        key={order.id ?? order.orderNumber}
        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleViewDetail(order)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-gray-900">{order.type}</h4>
              <Badge variant={priorityVariant}>{priorityLabel}</Badge>
              <Badge variant={statusVariant}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusLabel}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2">{description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {order.building} {order.unit} {order.roomNumber}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {order.ownerName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateTime(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {order.status === "COMPLETED" && rating > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {order.evaluationRemark || "业主已评价"}
              </span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待接单</p>
              <h3 className="text-gray-900">{stats.pending}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <h3 className="text-gray-900">{stats.processing}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <h3 className="text-gray-900">{stats.completed}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日完成</p>
              <h3 className="text-gray-900">{stats.todayCompleted}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={status} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pending">
              待接单 ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="processing">
              进行中 ({stats.processing})
            </TabsTrigger>
            <TabsTrigger value="completed">
              已完成 ({stats.completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => renderOrderCard(order))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {loading ? (
                  <p>加载中...</p>
                ) : (
                  <>
                    <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>暂无待接单工单</p>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => renderOrderCard(order))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {loading ? (
                  <p>加载中...</p>
                ) : (
                  <>
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>暂无进行中工单</p>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => renderOrderCard(order))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {loading ? (
                  <p>加载中...</p>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>暂无完成工单</p>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {currentOrder && (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>工单详情 - {currentOrder.orderNumber}</DialogTitle>
              <DialogDescription>
                {currentOrder.orderNumber} / {currentOrder.type}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    STATUS_VARIANT[currentOrder.status] ?? "outline"
                  }
                >
                  {STATUS_LABELS[currentOrder.status] ?? currentOrder.status}
                </Badge>
                <Badge
                  variant={
                    currentOrder.priority
                      ? PRIORITY_VARIANT[currentOrder.priority] ?? "secondary"
                      : "secondary"
                  }
                >
                  {currentOrder.priority
                    ? PRIORITY_LABELS[currentOrder.priority] ?? currentOrder.priority
                    : "普通"}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="text-gray-900">业主信息</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">业主：</span>
                    <span className="text-gray-900">{currentOrder.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">电话：</span>
                    <span className="text-gray-900">{currentOrder.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">地址：</span>
                    <span className="text-gray-900">
                      {currentOrder.building} {currentOrder.unit}{" "}
                      {currentOrder.roomNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-gray-900">问题描述</h4>
                <p className="text-gray-600 leading-relaxed">
                  {currentOrder.description || "暂无描述"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <span>提交时间：{formatDateTime(currentOrder.createdAt)}</span>
                {currentOrder.startedAt && (
                  <span>开始时间：{formatDateTime(currentOrder.startedAt)}</span>
                )}
                {currentOrder.finishedAt && (
                  <span>完成时间：{formatDateTime(currentOrder.finishedAt)}</span>
                )}
                {currentOrder.assignedWorker && (
                  <span>维修人员：{currentOrder.assignedWorker}</span>
                )}
              </div>

           

              <div className="flex items-center justify-end gap-3">
                {currentOrder.status === "PENDING" && (
                  <Button
                    onClick={() => handleAccept(currentOrder)}
                    disabled={actionOrderId === currentOrder.id}
                  >
                    接单
                  </Button>
                )}
                {currentOrder.status === "IN_PROGRESS" && (
                  <Button
                    onClick={() => handleComplete(currentOrder)}
                    disabled={actionOrderId === currentOrder.id}
                  >
                    完成工单
                  </Button>
                )}
                {currentOrder.status === "COMPLETED" && (
                  <Badge variant="outline">
                    {currentOrder.evaluationScore
                      ? `业主评分：${currentOrder.evaluationScore}分`
                      : "待评价"}
                  </Badge>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}
