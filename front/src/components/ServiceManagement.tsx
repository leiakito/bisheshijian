import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Search, Eye, Plus, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import { getAllRepairOrders, createRepairOrder, updateRepairOrderStatus } from "../services/repairService";
import { getAllComplaints, createComplaint, updateComplaintStatus } from "../services/complaintService";
import { getResidents } from "../services/residentService";
import type { RepairOrder, Complaint, RepairOrderRequest, ComplaintRequest, Resident } from "../types/api";
import { toast } from "sonner";

export function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // 报修管理状态
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  const [repairsLoading, setRepairsLoading] = useState(true);
  const [isAddRepairOpen, setIsAddRepairOpen] = useState(false);
  const [isAssignRepairOpen, setIsAssignRepairOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairOrder | null>(null);

  // 投诉管理状态
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [isAddComplaintOpen, setIsAddComplaintOpen] = useState(false);
  const [isReplyComplaintOpen, setIsReplyComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // 住户列表（用于选择）
  const [residents, setResidents] = useState<Resident[]>([]);

  // 报修表单数据
  const [repairFormData, setRepairFormData] = useState<RepairOrderRequest>({
    ownerName: "",
    phone: "",
    type: "",
    description: "",
    building: "",
    unit: "",
    roomNumber: "",
    priority: "NORMAL",
  });

  // 投诉表单数据
  const [complaintFormData, setComplaintFormData] = useState<ComplaintRequest>({
    ownerName: "",
    phone: "",
    type: "",
    description: "",
  });

  // 派单数据
  const [assignData, setAssignData] = useState({
    assignedWorker: "",
  });

  // 回复数据
  const [replyData, setReplyData] = useState({
    reply: "",
  });

  // 加载数据
  useEffect(() => {
    loadRepairs();
    loadComplaints();
    loadResidents();
  }, []);

  const loadRepairs = async () => {
    try {
      setRepairsLoading(true);
      const data = await getAllRepairOrders();
      setRepairs(data);
    } catch (err) {
      console.error("Failed to load repairs:", err);
      toast.error("加载报修列表失败");
    } finally {
      setRepairsLoading(false);
    }
  };

  const loadComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load complaints:", err);
      toast.error("加载投诉列表失败");
    } finally {
      setComplaintsLoading(false);
    }
  };

  const loadResidents = async () => {
    try {
      const data = await getResidents({ page: 0, size: 1000 });
      setResidents(data.content);
    } catch (err) {
      console.error("Failed to load residents:", err);
    }
  };

  const handleAddRepair = async () => {
    if (!repairFormData.ownerName || !repairFormData.phone || !repairFormData.type ||
        !repairFormData.description || !repairFormData.building || !repairFormData.unit ||
        !repairFormData.roomNumber) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await createRepairOrder(repairFormData);
      toast.success("提交报修成功");
      setIsAddRepairOpen(false);
      resetRepairForm();
      loadRepairs();
    } catch (err) {
      console.error("Failed to create repair:", err);
      toast.error(err instanceof Error ? err.message : "提交报修失败");
    }
  };

  const handleAssignRepair = async () => {
    if (!selectedRepair || !assignData.assignedWorker) {
      toast.error("请输入维修人员");
      return;
    }

    try {
      await updateRepairOrderStatus(selectedRepair.id, {
        status: "IN_PROGRESS",
        assignedWorker: assignData.assignedWorker,
      });
      toast.success("派单成功");
      setIsAssignRepairOpen(false);
      setSelectedRepair(null);
      setAssignData({ assignedWorker: "" });
      loadRepairs();
    } catch (err) {
      console.error("Failed to assign repair:", err);
      toast.error(err instanceof Error ? err.message : "派单失败");
    }
  };

  const handleCompleteRepair = async (repair: RepairOrder) => {
    try {
      await updateRepairOrderStatus(repair.id, {
        status: "COMPLETED",
      });
      toast.success("已标记为完成");
      loadRepairs();
    } catch (err) {
      console.error("Failed to complete repair:", err);
      toast.error(err instanceof Error ? err.message : "操作失败");
    }
  };

  const handleAddComplaint = async () => {
    if (!complaintFormData.ownerName || !complaintFormData.phone ||
        !complaintFormData.type || !complaintFormData.description) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await createComplaint(complaintFormData);
      toast.success("提交投诉成功");
      setIsAddComplaintOpen(false);
      resetComplaintForm();
      loadComplaints();
    } catch (err) {
      console.error("Failed to create complaint:", err);
      toast.error(err instanceof Error ? err.message : "提交投诉失败");
    }
  };

  const handleReplyComplaint = async () => {
    if (!selectedComplaint || !replyData.reply) {
      toast.error("请输入回复内容");
      return;
    }

    try {
      await updateComplaintStatus(selectedComplaint.id, {
        status: "COMPLETED",
        processedBy: "系统管理员", // 这里可以从当前登录用户获取
        reply: replyData.reply,
      });
      toast.success("回复成功");
      setIsReplyComplaintOpen(false);
      setSelectedComplaint(null);
      setReplyData({ reply: "" });
      loadComplaints();
    } catch (err) {
      console.error("Failed to reply complaint:", err);
      toast.error(err instanceof Error ? err.message : "回复失败");
    }
  };

  const handleProcessComplaint = async (complaint: Complaint) => {
    try {
      await updateComplaintStatus(complaint.id, {
        status: "PROCESSING",
        processedBy: "系统管理员",
      });
      toast.success("已开始处理");
      loadComplaints();
    } catch (err) {
      console.error("Failed to process complaint:", err);
      toast.error(err instanceof Error ? err.message : "操作失败");
    }
  };

  const resetRepairForm = () => {
    setRepairFormData({
      ownerName: "",
      phone: "",
      type: "",
      description: "",
      building: "",
      unit: "",
      roomNumber: "",
      priority: "NORMAL",
    });
  };

  const resetComplaintForm = () => {
    setComplaintFormData({
      ownerName: "",
      phone: "",
      type: "",
      description: "",
    });
  };

  const fillFormFromResident = (residentId: number) => {
    const resident = residents.find(r => r.id === residentId);
    if (resident) {
      setRepairFormData({
        ...repairFormData,
        ownerName: resident.name,
        phone: resident.phone,
        building: resident.building,
        unit: resident.unit,
        roomNumber: resident.roomNumber,
      });
    }
  };

  const fillComplaintFormFromResident = (residentId: number) => {
    const resident = residents.find(r => r.id === residentId);
    if (resident) {
      setComplaintFormData({
        ...complaintFormData,
        ownerName: resident.name,
        phone: resident.phone,
      });
    }
  };

  // 过滤报修列表
  const filteredRepairs = useMemo(() => {
    if (!searchQuery.trim()) {
      return repairs;
    }
    const query = searchQuery.toLowerCase();
    return repairs.filter((repair) => {
      return (
        repair.orderNumber?.toLowerCase().includes(query) ||
        repair.ownerName?.toLowerCase().includes(query) ||
        repair.phone?.toLowerCase().includes(query) ||
        repair.type?.toLowerCase().includes(query) ||
        repair.building?.toLowerCase().includes(query) ||
        repair.unit?.toLowerCase().includes(query) ||
        repair.roomNumber?.toLowerCase().includes(query)
      );
    });
  }, [repairs, searchQuery]);

  // 过滤投诉列表
  const filteredComplaints = useMemo(() => {
    if (!searchQuery.trim()) {
      return complaints;
    }
    const query = searchQuery.toLowerCase();
    return complaints.filter((complaint) => {
      return (
        complaint.ownerName?.toLowerCase().includes(query) ||
        complaint.phone?.toLowerCase().includes(query) ||
        complaint.type?.toLowerCase().includes(query) ||
        complaint.description?.toLowerCase().includes(query)
      );
    });
  }, [complaints, searchQuery]);

  // 统计数据
  const stats = useMemo(() => {
    return {
      pendingRepairs: repairs.filter(r => r.status === "PENDING").length,
      inProgressRepairs: repairs.filter(r => r.status === "IN_PROGRESS").length,
      pendingComplaints: complaints.filter(c => c.status === "RECEIVED").length,
      completedThisMonth: repairs.filter(r => r.status === "COMPLETED").length,
    };
  }, [repairs, complaints]);

  const statusColors: Record<string, string> = {
    PENDING: "secondary",
    IN_PROGRESS: "default",
    COMPLETED: "default",
    CANCELLED: "destructive",
    RECEIVED: "secondary",
    PROCESSING: "default",
    CLOSED: "default",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "待处理",
    IN_PROGRESS: "处理中",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
    RECEIVED: "已接收",
    PROCESSING: "处理中",
    CLOSED: "已关闭",
  };

  const priorityColors: Record<string, string> = {
    URGENT: "destructive",
    NORMAL: "secondary",
  };

  const priorityLabels: Record<string, string> = {
    URGENT: "紧急",
    NORMAL: "普通",
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-gray-500 text-sm">待处理报修</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingRepairs}</h3>
          <p className="text-sm text-gray-500 mt-1">需要尽快处理</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">处理中报修</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.inProgressRepairs}</h3>
          <p className="text-sm text-gray-500 mt-1">正在维修中</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">待处理投诉</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingComplaints}</h3>
          <p className="text-sm text-gray-500 mt-1">需要及时响应</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">本月完成</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.completedThisMonth}</h3>
          <p className="text-sm text-green-600 mt-1">已完成</p>
        </Card>
      </div>

      {/* 搜索栏 */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="搜索业主、房号、工单号..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="repairs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="repairs">报修管理</TabsTrigger>
          <TabsTrigger value="complaints">投诉建议</TabsTrigger>
        </TabsList>

        {/* 报修管理 */}
        <TabsContent value="repairs">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddRepairOpen} onOpenChange={setIsAddRepairOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新增报修
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新增报修</DialogTitle>
                    <DialogDescription>
                      填写报修信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>选择住户（可选）</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        onChange={(e) => fillFormFromResident(Number(e.target.value))}
                      >
                        <option value={0}>请选择住户（自动填充信息）</option>
                        {residents.map((resident) => (
                          <option key={resident.id} value={resident.id}>
                            {resident.name} - {resident.building} {resident.unit} {resident.roomNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>业主姓名 *</Label>
                        <Input
                          placeholder="请输入业主姓名"
                          value={repairFormData.ownerName}
                          onChange={(e) => setRepairFormData({ ...repairFormData, ownerName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>联系电话 *</Label>
                        <Input
                          placeholder="请输入联系电话"
                          value={repairFormData.phone}
                          onChange={(e) => setRepairFormData({ ...repairFormData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>楼栋 *</Label>
                        <Input
                          placeholder="如: 1号楼"
                          value={repairFormData.building}
                          onChange={(e) => setRepairFormData({ ...repairFormData, building: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>单元 *</Label>
                        <Input
                          placeholder="如: 2单元"
                          value={repairFormData.unit}
                          onChange={(e) => setRepairFormData({ ...repairFormData, unit: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>房号 *</Label>
                        <Input
                          placeholder="如: 301"
                          value={repairFormData.roomNumber}
                          onChange={(e) => setRepairFormData({ ...repairFormData, roomNumber: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>报修类型 *</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={repairFormData.type}
                          onChange={(e) => setRepairFormData({ ...repairFormData, type: e.target.value })}
                        >
                          <option value="">请选择类型</option>
                          <option value="水电维修">水电维修</option>
                          <option value="门窗维修">门窗维修</option>
                          <option value="电梯维护">电梯维护</option>
                          <option value="门禁维修">门禁维修</option>
                          <option value="其他">其他</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>优先级</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={repairFormData.priority}
                          onChange={(e) => setRepairFormData({ ...repairFormData, priority: e.target.value })}
                        >
                          <option value="NORMAL">普通</option>
                          <option value="URGENT">紧急</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>问题描述 *</Label>
                      <Textarea
                        placeholder="请详细描述报修问题"
                        value={repairFormData.description}
                        onChange={(e) => setRepairFormData({ ...repairFormData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddRepairOpen(false);
                        resetRepairForm();
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddRepair}
                    >
                      提交
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              {repairsLoading ? (
                <div className="p-12 text-center text-gray-500">加载中...</div>
              ) : filteredRepairs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的报修" : "暂无报修数据"}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>工单号</TableHead>
                      <TableHead>业主</TableHead>
                      <TableHead>房屋</TableHead>
                      <TableHead>报修类型</TableHead>
                      <TableHead>优先级</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>维修人员</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRepairs.map((repair) => (
                      <TableRow key={repair.id}>
                        <TableCell className="text-sm text-gray-500">
                          {repair.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{repair.ownerName}</div>
                            <div className="text-sm text-gray-500">
                              {repair.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {repair.building} {repair.unit} {repair.roomNumber}
                        </TableCell>
                        <TableCell>{repair.type}</TableCell>
                        <TableCell>
                          <Badge variant={priorityColors[repair.priority] as any}>
                            {priorityLabels[repair.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[repair.status] as any}>
                            {statusLabels[repair.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{repair.assignedWorker || "-"}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(repair.createdAt).toLocaleString("zh-CN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {repair.status === "PENDING" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRepair(repair);
                                  setIsAssignRepairOpen(true);
                                }}
                              >
                                派单
                              </Button>
                            )}
                            {repair.status === "IN_PROGRESS" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompleteRepair(repair)}
                              >
                                完成
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>

          {/* 派单对话框 */}
          <Dialog open={isAssignRepairOpen} onOpenChange={setIsAssignRepairOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>派单</DialogTitle>
                <DialogDescription>
                  为报修单 {selectedRepair?.orderNumber} 指定维修人员
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>维修人员 *</Label>
                  <Input
                    placeholder="请输入维修人员姓名"
                    value={assignData.assignedWorker}
                    onChange={(e) => setAssignData({ assignedWorker: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAssignRepairOpen(false);
                    setSelectedRepair(null);
                    setAssignData({ assignedWorker: "" });
                  }}
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAssignRepair}
                >
                  确定
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 投诉建议 */}
        <TabsContent value="complaints">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddComplaintOpen} onOpenChange={setIsAddComplaintOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新增投诉
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新增投诉</DialogTitle>
                    <DialogDescription>
                      填写投诉信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>选择住户（可选）</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        onChange={(e) => fillComplaintFormFromResident(Number(e.target.value))}
                      >
                        <option value={0}>请选择住户（自动填充信息）</option>
                        {residents.map((resident) => (
                          <option key={resident.id} value={resident.id}>
                            {resident.name} - {resident.building} {resident.unit} {resident.roomNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>业主姓名 *</Label>
                        <Input
                          placeholder="请输入业主姓名"
                          value={complaintFormData.ownerName}
                          onChange={(e) => setComplaintFormData({ ...complaintFormData, ownerName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>联系电话 *</Label>
                        <Input
                          placeholder="请输入联系电话"
                          value={complaintFormData.phone}
                          onChange={(e) => setComplaintFormData({ ...complaintFormData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>投诉类型 *</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={complaintFormData.type}
                        onChange={(e) => setComplaintFormData({ ...complaintFormData, type: e.target.value })}
                      >
                        <option value="">请选择类型</option>
                        <option value="噪音投诉">噪音投诉</option>
                        <option value="环境卫生">环境卫生</option>
                        <option value="停车问题">停车问题</option>
                        <option value="物业服务">物业服务</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>投诉内容 *</Label>
                      <Textarea
                        placeholder="请详细描述投诉内容"
                        value={complaintFormData.description}
                        onChange={(e) => setComplaintFormData({ ...complaintFormData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddComplaintOpen(false);
                        resetComplaintForm();
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddComplaint}
                    >
                      提交
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              {complaintsLoading ? (
                <div className="p-12 text-center text-gray-500">加载中...</div>
              ) : filteredComplaints.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的投诉" : "暂无投诉数据"}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>业主</TableHead>
                      <TableHead>投诉类型</TableHead>
                      <TableHead>内容</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>处理人</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="text-sm text-gray-500">
                          #{complaint.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{complaint.ownerName}</div>
                            <div className="text-sm text-gray-500">
                              {complaint.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{complaint.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {complaint.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[complaint.status] as any}>
                            {statusLabels[complaint.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{complaint.processedBy || "-"}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(complaint.createdAt).toLocaleString("zh-CN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {complaint.status === "RECEIVED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProcessComplaint(complaint)}
                              >
                                处理
                              </Button>
                            )}
                            {(complaint.status === "PROCESSING" || complaint.status === "RECEIVED") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedComplaint(complaint);
                                  setIsReplyComplaintOpen(true);
                                }}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            )}
                            {complaint.reply && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    查看
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>投诉详情 #{complaint.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>投诉内容</Label>
                                      <p className="mt-1 text-gray-600">{complaint.description}</p>
                                    </div>
                                    {complaint.reply && (
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <Label>处理回复</Label>
                                        <p className="mt-1 text-gray-600">{complaint.reply}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>

          {/* 回复对话框 */}
          <Dialog open={isReplyComplaintOpen} onOpenChange={setIsReplyComplaintOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>回复投诉</DialogTitle>
                <DialogDescription>
                  回复投诉 #{selectedComplaint?.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>投诉内容</Label>
                  <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedComplaint?.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>回复内容 *</Label>
                  <Textarea
                    placeholder="请输入回复内容"
                    value={replyData.reply}
                    onChange={(e) => setReplyData({ reply: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReplyComplaintOpen(false);
                    setSelectedComplaint(null);
                    setReplyData({ reply: "" });
                  }}
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleReplyComplaint}
                >
                  提交回复
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
