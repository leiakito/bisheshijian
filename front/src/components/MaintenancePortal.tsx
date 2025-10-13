import { Fragment } from "react";
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
import { clearMaintenanceSession, getMaintenanceSession } from "../utils/sessionManager";

type MaintenanceStatus = "pending" | "processing" | "completed";

const orders = [
  {
    id: "R20250105001",
    owner: "张三",
    phone: "138****1234",
    building: "1号楼",
    unit: "2单元",
    room: "301",
    type: "水管漏水",
    category: "水电维修",
    description: "厨房水管接口处漏水，水流较大，需要紧急处理",
    status: "待接单",
    priority: "紧急",
    submitTime: "2025-01-11 08:30",
    images: 2,
    assignedWorker: "王师傅",
  },
  {
    id: "R20250105002",
    owner: "李四",
    phone: "139****5678",
    building: "1号楼",
    unit: "2单元",
    room: "302",
    type: "电梯故障",
    category: "电梯维护",
    description: "电梯按键失灵，2楼和3楼按钮无反应",
    status: "处理中",
    priority: "紧急",
    submitTime: "2025-01-11 06:45",
    images: 1,
    assignedWorker: "王师傅",
    startTime: "2025-01-11 07:00",
  },
  {
    id: "R20250104001",
    owner: "王五",
    phone: "136****9012",
    building: "2号楼",
    unit: "1单元",
    room: "501",
    type: "门禁损坏",
    category: "门禁维修",
    description: "单元门禁刷卡无反应，可能是读卡器故障",
    status: "已完成",
    priority: "普通",
    submitTime: "2025-01-10 16:20",
    images: 0,
    assignedWorker: "王师傅",
    startTime: "2025-01-10 17:00",
    finishTime: "2025-01-10 18:30",
    rating: 5,
    feedback: "维修很及时，师傅很专业！",
  },
  {
    id: "R20250103001",
    owner: "赵六",
    phone: "137****3456",
    building: "3号楼",
    unit: "3单元",
    room: "201",
    type: "灯具维修",
    category: "水电维修",
    description: "客厅吸顶灯不亮，可能是灯管坏了",
    status: "已完成",
    priority: "普通",
    submitTime: "2025-01-03 14:10",
    images: 1,
    assignedWorker: "王师傅",
    startTime: "2025-01-03 15:00",
    finishTime: "2025-01-03 16:00",
    rating: 5,
    feedback: "服务很好，已经修好了",
  },
];

function getValidStatus(status?: string): MaintenanceStatus {
  if (status === "processing" || status === "completed") {
    return status;
  }
  return "pending";
}

export function MaintenancePortalLayout() {
  const navigate = useNavigate();
  const session = getMaintenanceSession();
  const workerName = session?.name || "维修师傅";

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

  const filteredOrders = orders.filter((order) => {
    if (status === "pending") return order.status === "待接单";
    if (status === "processing") return order.status === "处理中";
    return order.status === "已完成";
  });

  const stats = {
    pending: orders.filter((o) => o.status === "待接单").length,
    processing: orders.filter((o) => o.status === "处理中").length,
    completed: orders.filter((o) => o.status === "已完成").length,
    todayCompleted: 3,
  };

  const currentOrder = orders.find((order) => order.id === orderId) || null;
  const isDialogOpen = Boolean(orderId);

  const handleTabChange = (nextStatus: string) => {
    const valid = getValidStatus(nextStatus);
    navigate(`/maintenance/orders/${valid}`, { replace: true });
  };

  const handleViewDetail = (orderIdValue: string) => {
    navigate(`/maintenance/orders/${status}/${orderIdValue}`);
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

  const handleAccept = (orderIdValue: string) => {
    console.log("接单:", orderIdValue);
    navigate(`/maintenance/orders/${status}`, { replace: true });
  };

  const handleStart = (orderIdValue: string) => {
    console.log("开始处理:", orderIdValue);
    navigate(`/maintenance/orders/${status}`, { replace: true });
  };

  const handleComplete = (orderIdValue: string) => {
    console.log("完成工单:", orderIdValue);
    navigate(`/maintenance/orders/${status}`, { replace: true });
  };

  const renderOrderCard = (order: typeof orders[number]) => (
    <Card
      key={order.id}
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleViewDetail(order.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-gray-900">{order.type}</h4>
            <Badge
              variant={order.priority === "紧急" ? "destructive" : "secondary"}
            >
              {order.priority}
            </Badge>
            <Badge
              variant={
                order.status === "已完成"
                  ? "default"
                  : order.status === "处理中"
                  ? "secondary"
                  : "outline"
              }
            >
              {order.status === "待接单" && <AlertCircle className="w-3 h-3 mr-1" />}
              {order.status === "处理中" && <Clock className="w-3 h-3 mr-1" />}
              {order.status === "已完成" && <CheckCircle className="w-3 h-3 mr-1" />}
              {order.status}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm mb-2">{order.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {order.building} {order.unit} {order.room}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {order.owner}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {order.submitTime}
            </span>
          </div>
        </div>
      </div>
      {order.status === "已完成" && order.rating && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(order.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{order.feedback}</span>
          </div>
        </div>
      )}
    </Card>
  );

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
                <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>暂无待接单工单</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => renderOrderCard(order))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>暂无进行中工单</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => renderOrderCard(order))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>暂无完成工单</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {currentOrder && (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>工单详情 - {currentOrder.id}</DialogTitle>
              <DialogDescription>
                {currentOrder.category} / {currentOrder.type}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    currentOrder.status === "已完成"
                      ? "default"
                      : currentOrder.status === "处理中"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {currentOrder.status}
                </Badge>
                <Badge
                  variant={
                    currentOrder.priority === "紧急"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {currentOrder.priority}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="text-gray-900">业主信息</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">业主：</span>
                    <span className="text-gray-900">{currentOrder.owner}</span>
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
                      {currentOrder.room}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-gray-900">问题描述</h4>
                <p className="text-gray-600 leading-relaxed">
                  {currentOrder.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <span>提交时间：{currentOrder.submitTime}</span>
                {currentOrder.startTime && (
                  <span>开始时间：{currentOrder.startTime}</span>
                )}
                {currentOrder.finishTime && (
                  <span>完成时间：{currentOrder.finishTime}</span>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-gray-900">处理备注</h4>
                <Textarea placeholder="填写处理过程和结果" className="min-h-[120px]" />
              </div>

              <div className="flex items-center justify-end gap-3">
                {currentOrder.status === "待接单" && (
                  <Button onClick={() => handleAccept(currentOrder.id)}>
                    接单
                  </Button>
                )}
                {currentOrder.status === "处理中" && (
                  <Fragment>
                    <Button
                      variant="outline"
                      onClick={() => handleStart(currentOrder.id)}
                    >
                      开始处理
                    </Button>
                    <Button onClick={() => handleComplete(currentOrder.id)}>
                      完成工单
                    </Button>
                  </Fragment>
                )}
                {currentOrder.status === "已完成" && (
                  <Badge variant="outline">
                    {currentOrder.rating ? `业主评分：${currentOrder.rating}分` : "待评价"}
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
