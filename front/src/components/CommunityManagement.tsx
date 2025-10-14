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
import {
  Search,
  Plus,
  Edit,
  Bell,
  Trash2,
  Car,
  Wrench,
  Shield,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { createAnnouncement, getLatestAnnouncements, updateAnnouncement, deleteAnnouncement } from "../services/announcementService";
import { getFacilities, createFacility, updateFacility, deleteFacility } from "../services/facilityService";
import { getParkingSpaces, createParkingSpace, updateParkingSpace, deleteParkingSpace } from "../services/parkingSpaceService";
import type { Announcement, AnnouncementRequest, Facility, FacilityRequest, ParkingSpace, ParkingSpaceRequest } from "../types/api";

export function CommunityManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);

  // 设施管理状态
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [isEditFacilityOpen, setIsEditFacilityOpen] = useState(false);
  const [isDeleteFacilityDialogOpen, setIsDeleteFacilityDialogOpen] = useState(false);
  const [facilitySubmitting, setFacilitySubmitting] = useState(false);
  const [facilityDeleting, setFacilityDeleting] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deletingFacility, setDeletingFacility] = useState<Facility | null>(null);

  // 停车位管理状态
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [parkingLoading, setParkingLoading] = useState(false);
  const [isAddParkingOpen, setIsAddParkingOpen] = useState(false);
  const [isEditParkingOpen, setIsEditParkingOpen] = useState(false);
  const [isDeleteParkingDialogOpen, setIsDeleteParkingDialogOpen] = useState(false);
  const [parkingSubmitting, setParkingSubmitting] = useState(false);
  const [parkingDeleting, setParkingDeleting] = useState(false);
  const [editingParking, setEditingParking] = useState<ParkingSpace | null>(null);
  const [deletingParking, setDeletingParking] = useState<ParkingSpace | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<AnnouncementRequest>({
    title: "",
    content: "",
    targetScope: "",
  });

  // 设施表单状态
  const [facilityFormData, setFacilityFormData] = useState<FacilityRequest>({
    name: "",
    type: "",
    location: "",
    status: "",
    lastMaintenance: "",
    nextMaintenance: "",
    responsible: "",
  });

  // 停车位表单状态
  const [parkingFormData, setParkingFormData] = useState<ParkingSpaceRequest>({
    spaceNumber: "",
    area: "",
    type: "",
    owner: "",
    building: "",
    plateNumber: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // 加载公告列表
  useEffect(() => {
    loadAnnouncements();
    loadFacilities();
    loadParkingSpaces();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getLatestAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("加载公告失败:", error);
      toast.error("加载公告列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 加载设施列表
  const loadFacilities = async () => {
    try {
      setFacilitiesLoading(true);
      const data = await getFacilities();
      setFacilities(data);
    } catch (error) {
      console.error("加载设施失败:", error);
      toast.error("加载设施列表失败");
    } finally {
      setFacilitiesLoading(false);
    }
  };

  // 加载停车位列表
  const loadParkingSpaces = async () => {
    try {
      setParkingLoading(true);
      const data = await getParkingSpaces();
      setParkingSpaces(data);
    } catch (error) {
      console.error("加载停车位失败:", error);
      toast.error("加载停车位列表失败");
    } finally {
      setParkingLoading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    // 验证表单
    if (!formData.title.trim()) {
      toast.error("请输入公告标题");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("请输入公告内容");
      return;
    }

    console.log("=== 准备发送公告数据 ===");
    console.log("表单数据:", formData);

    try {
      setSubmitting(true);
      const result = await createAnnouncement(formData);
      console.log("=== 公告创建成功 ===");
      console.log("返回数据:", result);
      toast.success("公告发布成功");

      // 关闭对话框
      setIsAddAnnouncementOpen(false);

      // 重置表单
      setFormData({
        title: "",
        content: "",
        targetScope: "",
      });

      // 重新加载列表
      loadAnnouncements();
    } catch (error) {
      console.error("发布公告失败:", error);
      toast.error(error instanceof Error ? error.message : "发布公告失败");
    } finally {
      setSubmitting(false);
    }
  };

  // 处理表单字段变化
  const handleFieldChange = (field: keyof AnnouncementRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 处理编辑按钮点击
  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      targetScope: announcement.targetScope || "",
    });
    setIsEditAnnouncementOpen(true);
  };

  // 处理更新提交
  const handleUpdate = async () => {
    if (!editingAnnouncement?.id) {
      toast.error("公告 ID 不存在");
      return;
    }

    // 验证表单
    if (!formData.title.trim()) {
      toast.error("请输入公告标题");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("请输入公告内容");
      return;
    }

    console.log("=== 准备更新公告数据 ===");
    console.log("公告ID:", editingAnnouncement.id);
    console.log("表单数据:", formData);

    try {
      setSubmitting(true);
      const result = await updateAnnouncement(editingAnnouncement.id, formData);
      console.log("=== 公告更新成功 ===");
      console.log("返回数据:", result);
      toast.success("公告更新成功");

      // 关闭对话框
      setIsEditAnnouncementOpen(false);
      setEditingAnnouncement(null);

      // 重置表单
      setFormData({
        title: "",
        content: "",
        targetScope: "",
      });

      // 重新加载列表
      loadAnnouncements();
    } catch (error) {
      console.error("更新公告失败:", error);
      toast.error(error instanceof Error ? error.message : "更新公告失败");
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除按钮点击
  const handleDeleteClick = (announcement: Announcement) => {
    setDeletingAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  // 处理删除确认
  const handleDeleteConfirm = async () => {
    if (!deletingAnnouncement?.id) {
      toast.error("公告 ID 不存在");
      return;
    }

    console.log("=== 准备删除公告 ===");
    console.log("公告ID:", deletingAnnouncement.id);
    console.log("公告标题:", deletingAnnouncement.title);

    try {
      setDeleting(true);
      await deleteAnnouncement(deletingAnnouncement.id);
      console.log("=== 公告删除成功 ===");
      toast.success("公告删除成功");

      // 关闭对话框
      setIsDeleteDialogOpen(false);
      setDeletingAnnouncement(null);

      // 重新加载列表
      loadAnnouncements();
    } catch (error) {
      console.error("删除公告失败:", error);
      toast.error(error instanceof Error ? error.message : "删除公告失败");
    } finally {
      setDeleting(false);
    }
  };

  // === 设施管理函数 ===

  // 处理设施表单字段变化
  const handleFacilityFieldChange = (field: keyof FacilityRequest, value: string) => {
    setFacilityFormData(prev => ({ ...prev, [field]: value }));
  };

  // 处理添加设施提交
  const handleFacilitySubmit = async () => {
    // 验证表单
    if (!facilityFormData.name.trim()) {
      toast.error("请输入设施名称");
      return;
    }
    if (!facilityFormData.type.trim()) {
      toast.error("请输入设施类型");
      return;
    }
    if (!facilityFormData.location.trim()) {
      toast.error("请输入设施位置");
      return;
    }
    if (!facilityFormData.status.trim()) {
      toast.error("请选择设施状态");
      return;
    }

    console.log("=== 准备添加设施 ===");
    console.log("表单数据:", facilityFormData);

    try {
      setFacilitySubmitting(true);
      const result = await createFacility(facilityFormData);
      console.log("=== 设施创建成功 ===");
      console.log("返回数据:", result);
      toast.success("设施添加成功");

      // 关闭对话框
      setIsAddFacilityOpen(false);

      // 重置表单
      setFacilityFormData({
        name: "",
        type: "",
        location: "",
        status: "",
        lastMaintenance: "",
        nextMaintenance: "",
        responsible: "",
      });

      // 重新加载列表
      loadFacilities();
    } catch (error) {
      console.error("添加设施失败:", error);
      toast.error(error instanceof Error ? error.message : "添加设施失败");
    } finally {
      setFacilitySubmitting(false);
    }
  };

  // 处理编辑设施按钮点击
  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility);
    setFacilityFormData({
      name: facility.name,
      type: facility.type,
      location: facility.location,
      status: facility.status,
      lastMaintenance: facility.lastMaintenance || "",
      nextMaintenance: facility.nextMaintenance || "",
      responsible: facility.responsible || "",
    });
    setIsEditFacilityOpen(true);
  };

  // 处理更新设施提交
  const handleFacilityUpdate = async () => {
    if (!editingFacility?.id) {
      toast.error("设施 ID 不存在");
      return;
    }

    // 验证表单
    if (!facilityFormData.name.trim()) {
      toast.error("请输入设施名称");
      return;
    }
    if (!facilityFormData.type.trim()) {
      toast.error("请输入设施类型");
      return;
    }
    if (!facilityFormData.location.trim()) {
      toast.error("请输入设施位置");
      return;
    }
    if (!facilityFormData.status.trim()) {
      toast.error("请选择设施状态");
      return;
    }

    console.log("=== 准备更新设施 ===");
    console.log("设施ID:", editingFacility.id);
    console.log("表单数据:", facilityFormData);

    try {
      setFacilitySubmitting(true);
      const result = await updateFacility(editingFacility.id, facilityFormData);
      console.log("=== 设施更新成功 ===");
      console.log("返回数据:", result);
      toast.success("设施更新成功");

      // 关闭对话框
      setIsEditFacilityOpen(false);
      setEditingFacility(null);

      // 重置表单
      setFacilityFormData({
        name: "",
        type: "",
        location: "",
        status: "",
        lastMaintenance: "",
        nextMaintenance: "",
        responsible: "",
      });

      // 重新加载列表
      loadFacilities();
    } catch (error) {
      console.error("更新设施失败:", error);
      toast.error(error instanceof Error ? error.message : "更新设施失败");
    } finally {
      setFacilitySubmitting(false);
    }
  };

  // 处理删除设施按钮点击
  const handleDeleteFacilityClick = (facility: Facility) => {
    setDeletingFacility(facility);
    setIsDeleteFacilityDialogOpen(true);
  };

  // 处理删除设施确认
  const handleDeleteFacilityConfirm = async () => {
    if (!deletingFacility?.id) {
      toast.error("设施 ID 不存在");
      return;
    }

    console.log("=== 准备删除设施 ===");
    console.log("设施ID:", deletingFacility.id);
    console.log("设施名称:", deletingFacility.name);

    try {
      setFacilityDeleting(true);
      await deleteFacility(deletingFacility.id);
      console.log("=== 设施删除成功 ===");
      toast.success("设施删除成功");

      // 关闭对话框
      setIsDeleteFacilityDialogOpen(false);
      setDeletingFacility(null);

      // 重新加载列表
      loadFacilities();
    } catch (error) {
      console.error("删除设施失败:", error);
      toast.error(error instanceof Error ? error.message : "删除设施失败");
    } finally {
      setFacilityDeleting(false);
    }
  };

  // === 停车位管理函数 ===

  // 处理停车位表单字段变化
  const handleParkingFieldChange = (field: keyof ParkingSpaceRequest, value: string) => {
    setParkingFormData(prev => ({ ...prev, [field]: value }));
  };

  // 处理添加停车位提交
  const handleParkingSubmit = async () => {
    // 验证表单
    if (!parkingFormData.spaceNumber.trim()) {
      toast.error("请输入车位号");
      return;
    }
    if (!parkingFormData.status.trim()) {
      toast.error("请选择停车位状态");
      return;
    }

    console.log("=== 准备添加停车位 ===");
    console.log("表单数据:", parkingFormData);

    try {
      setParkingSubmitting(true);
      const result = await createParkingSpace(parkingFormData);
      console.log("=== 停车位创建成功 ===");
      console.log("返回数据:", result);
      toast.success("停车位添加成功");

      // 关闭对话框
      setIsAddParkingOpen(false);

      // 重置表单
      setParkingFormData({
        spaceNumber: "",
        area: "",
        type: "",
        owner: "",
        building: "",
        plateNumber: "",
        status: "",
        startDate: "",
        endDate: "",
      });

      // 重新加载列表
      loadParkingSpaces();
    } catch (error) {
      console.error("添加停车位失败:", error);
      toast.error(error instanceof Error ? error.message : "添加停车位失败");
    } finally {
      setParkingSubmitting(false);
    }
  };

  // 处理编辑停车位按钮点击
  const handleEditParking = (parking: ParkingSpace) => {
    setEditingParking(parking);
    setParkingFormData({
      spaceNumber: parking.spaceNumber,
      area: parking.area || "",
      type: parking.type || "",
      owner: parking.owner || "",
      building: parking.building || "",
      plateNumber: parking.plateNumber || "",
      status: parking.status,
      startDate: parking.startDate || "",
      endDate: parking.endDate || "",
    });
    setIsEditParkingOpen(true);
  };

  // 处理更新停车位提交
  const handleParkingUpdate = async () => {
    if (!editingParking?.id) {
      toast.error("停车位 ID 不存在");
      return;
    }

    // 验证表单
    if (!parkingFormData.spaceNumber.trim()) {
      toast.error("请输入车位号");
      return;
    }
    if (!parkingFormData.status.trim()) {
      toast.error("请选择停车位状态");
      return;
    }

    console.log("=== 准备更新停车位 ===");
    console.log("停车位ID:", editingParking.id);
    console.log("表单数据:", parkingFormData);

    try {
      setParkingSubmitting(true);
      const result = await updateParkingSpace(editingParking.id, parkingFormData);
      console.log("=== 停车位更新成功 ===");
      console.log("返回数据:", result);
      toast.success("停车位更新成功");

      // 关闭对话框
      setIsEditParkingOpen(false);
      setEditingParking(null);

      // 重置表单
      setParkingFormData({
        spaceNumber: "",
        area: "",
        type: "",
        owner: "",
        building: "",
        plateNumber: "",
        status: "",
        startDate: "",
        endDate: "",
      });

      // 重新加载列表
      loadParkingSpaces();
    } catch (error) {
      console.error("更新停车位失败:", error);
      toast.error(error instanceof Error ? error.message : "更新停车位失败");
    } finally {
      setParkingSubmitting(false);
    }
  };

  // 处理删除停车位按钮点击
  const handleDeleteParkingClick = (parking: ParkingSpace) => {
    setDeletingParking(parking);
    setIsDeleteParkingDialogOpen(true);
  };

  // 处理删除停车位确认
  const handleDeleteParkingConfirm = async () => {
    if (!deletingParking?.id) {
      toast.error("停车位 ID 不存在");
      return;
    }

    console.log("=== 准备删除停车位 ===");
    console.log("停车位ID:", deletingParking.id);
    console.log("车位号:", deletingParking.spaceNumber);

    try {
      setParkingDeleting(true);
      await deleteParkingSpace(deletingParking.id);
      console.log("=== 停车位删除成功 ===");
      toast.success("停车位删除成功");

      // 关闭对话框
      setIsDeleteParkingDialogOpen(false);
      setDeletingParking(null);

      // 重新加载列表
      loadParkingSpaces();
    } catch (error) {
      console.error("删除停车位失败:", error);
      toast.error(error instanceof Error ? error.message : "删除停车位失败");
    } finally {
      setParkingDeleting(false);
    }
  };

  // 过滤公告
  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) {
      return announcements;
    }
    const query = searchQuery.toLowerCase();
    return announcements.filter((announcement) => {
      return (
        announcement.title?.toLowerCase().includes(query) ||
        announcement.content?.toLowerCase().includes(query) ||
        announcement.targetScope?.toLowerCase().includes(query) ||
        announcement.publisher?.toLowerCase().includes(query) ||
        announcement.category?.toLowerCase().includes(query)
      );
    });
  }, [announcements, searchQuery]);

  // 过滤设施
  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) {
      return facilities;
    }
    const query = searchQuery.toLowerCase();
    return facilities.filter((facility) => {
      return (
        facility.name?.toLowerCase().includes(query) ||
        facility.type?.toLowerCase().includes(query) ||
        facility.location?.toLowerCase().includes(query) ||
        facility.status?.toLowerCase().includes(query) ||
        facility.responsible?.toLowerCase().includes(query)
      );
    });
  }, [facilities, searchQuery]);

  // 过滤停车位
  const filteredParkingSpaces = useMemo(() => {
    if (!searchQuery.trim()) {
      return parkingSpaces;
    }
    const query = searchQuery.toLowerCase();
    return parkingSpaces.filter((space) => {
      return (
        space.spaceNumber?.toLowerCase().includes(query) ||
        space.area?.toLowerCase().includes(query) ||
        space.type?.toLowerCase().includes(query) ||
        space.owner?.toLowerCase().includes(query) ||
        space.building?.toLowerCase().includes(query) ||
        space.plateNumber?.toLowerCase().includes(query) ||
        space.status?.toLowerCase().includes(query)
      );
    });
  }, [parkingSpaces, searchQuery]);

  const patrols = [
    {
      id: "1",
      date: "2025-01-11",
      shift: "早班",
      guard: "保安小李",
      route: "东门-1号楼-中心花园-西门",
      checkpoints: 8,
      completed: 8,
      status: "已完成",
      time: "06:00-14:00",
    },
    {
      id: "2",
      date: "2025-01-11",
      shift: "中班",
      guard: "保安小王",
      route: "全区巡视",
      checkpoints: 12,
      completed: 7,
      status: "进行中",
      time: "14:00-22:00",
    },
    {
      id: "3",
      date: "2025-01-10",
      shift: "晚班",
      guard: "保安老张",
      route: "全区巡视",
      checkpoints: 10,
      completed: 10,
      status: "已完成",
      time: "22:00-06:00",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索公告、设施、车位..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // 触发搜索（实际上搜索是实时的，这里只是为了用户体验）
                  e.currentTarget.blur();
                }
              }}
              className="pl-10"
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // 触发搜索（实际上搜索是实时的，这里只是为了用户体验）
              if (searchQuery.trim()) {
                toast.success(`搜索: ${searchQuery}`);
              }
            }}
          >
            <Search className="w-4 h-4 mr-2" />
            搜索
          </Button>
        </div>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements">公告通知</TabsTrigger>
          <TabsTrigger value="facilities">公共设施</TabsTrigger>
          <TabsTrigger value="parking">停车管理</TabsTrigger>
      
        </TabsList>

        {/* 公告通知 */}
        <TabsContent value="announcements">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog
                open={isAddAnnouncementOpen}
                onOpenChange={setIsAddAnnouncementOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    发布公告
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>发布新公告</DialogTitle>
                    <DialogDescription>
                      填写公告信息并选择通知范围
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>公告标题 <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="请输入公告标题"
                        value={formData.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>通知范围</Label>
                      <Input
                        placeholder="如：全小区、1号楼、2单元等（可选）"
                        value={formData.targetScope}
                        onChange={(e) => handleFieldChange("targetScope", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>公告内容 <span className="text-red-500">*</span></Label>
                      <Textarea
                        placeholder="请输入公告详细内容..."
                        rows={6}
                        value={formData.content}
                        onChange={(e) => handleFieldChange("content", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddAnnouncementOpen(false)}
                      disabled={submitting}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? "发布中..." : "发布"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 编辑公告对话框 */}
            <Dialog
              open={isEditAnnouncementOpen}
              onOpenChange={(open) => {
                setIsEditAnnouncementOpen(open);
                if (!open) {
                  setEditingAnnouncement(null);
                  setFormData({ title: "", content: "", targetScope: "" });
                }
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>编辑公告</DialogTitle>
                  <DialogDescription>
                    修改公告信息
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>公告标题 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="请输入公告标题"
                      value={formData.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>通知范围</Label>
                    <Input
                      placeholder="如：全小区、1号楼、2单元等（可选）"
                      value={formData.targetScope}
                      onChange={(e) => handleFieldChange("targetScope", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>公告内容 <span className="text-red-500">*</span></Label>
                    <Textarea
                      placeholder="请输入公告详细内容..."
                      rows={6}
                      value={formData.content}
                      onChange={(e) => handleFieldChange("content", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditAnnouncementOpen(false)}
                    disabled={submitting}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdate}
                    disabled={submitting}
                  >
                    {submitting ? "保存中..." : "保存"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* 删除确认对话框 */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                setIsDeleteDialogOpen(open);
                if (!open) {
                  setDeletingAnnouncement(null);
                }
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>确认删除</DialogTitle>
                  <DialogDescription>
                    您确定要删除这条公告吗？此操作无法撤销。
                  </DialogDescription>
                </DialogHeader>
                {deletingAnnouncement && (
                  <div className="py-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">{deletingAnnouncement.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{deletingAnnouncement.content}</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={deleting}
                  >
                    取消
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? "删除中..." : "确认删除"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {loading ? (
              <Card className="p-6">
                <div className="text-center text-gray-500">加载中...</div>
              </Card>
            ) : filteredAnnouncements.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的公告" : "暂无公告"}
                </div>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Bell className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-900">{announcement.title}</h3>
                          {announcement.category && (
                            <Badge variant="outline">{announcement.category}</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {announcement.publisher && (
                            <span>发布人：{announcement.publisher}</span>
                          )}
                          {announcement.publishAt && (
                            <span>发布时间：{new Date(announcement.publishAt).toLocaleString('zh-CN')}</span>
                          )}
                          {announcement.targetScope && (
                            <span>通知范围：{announcement.targetScope}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(announcement)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* 公共设施 */}
        <TabsContent value="facilities">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog
                open={isAddFacilityOpen}
                onOpenChange={setIsAddFacilityOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    添加设施
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>添加新设施</DialogTitle>
                    <DialogDescription>
                      填写设施信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>设施名称 <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="如：1号楼电梯1"
                          value={facilityFormData.name}
                          onChange={(e) => handleFacilityFieldChange("name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>设施类型 <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="如：电梯、消防设施等"
                          value={facilityFormData.type}
                          onChange={(e) => handleFacilityFieldChange("type", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>设施位置 <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="如：1号楼1单元"
                          value={facilityFormData.location}
                          onChange={(e) => handleFacilityFieldChange("location", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>状态 <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="如：正常、维护中等"
                          value={facilityFormData.status}
                          onChange={(e) => handleFacilityFieldChange("status", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>上次维护时间</Label>
                        <Input
                          type="date"
                          value={facilityFormData.lastMaintenance}
                          onChange={(e) => handleFacilityFieldChange("lastMaintenance", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>下次维护时间</Label>
                        <Input
                          type="date"
                          value={facilityFormData.nextMaintenance}
                          onChange={(e) => handleFacilityFieldChange("nextMaintenance", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>负责人</Label>
                      <Input
                        placeholder="请输入负责人姓名"
                        value={facilityFormData.responsible}
                        onChange={(e) => handleFacilityFieldChange("responsible", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddFacilityOpen(false)}
                      disabled={facilitySubmitting}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleFacilitySubmit}
                      disabled={facilitySubmitting}
                    >
                      {facilitySubmitting ? "添加中..." : "添加"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Card>
            {facilitiesLoading ? (
              <div className="p-6">
                <div className="text-center text-gray-500">加载中...</div>
              </div>
            ) : filteredFacilities.length === 0 ? (
              <div className="p-6">
                <div className="text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的设施" : "暂无设施数据"}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>设施名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>位置</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>上次维护</TableHead>
                    <TableHead>下次维护</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-gray-400" />
                          {facility.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{facility.type}</Badge>
                      </TableCell>
                      <TableCell>{facility.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            facility.status === "正常" ? "default" : "secondary"
                          }
                        >
                          {facility.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {facility.lastMaintenance || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {facility.nextMaintenance || "-"}
                      </TableCell>
                      <TableCell>{facility.responsible || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFacility(facility)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteFacilityClick(facility)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* 编辑设施对话框 */}
          <Dialog
            open={isEditFacilityOpen}
            onOpenChange={(open) => {
              setIsEditFacilityOpen(open);
              if (!open) {
                setEditingFacility(null);
                setFacilityFormData({
                  name: "",
                  type: "",
                  location: "",
                  status: "",
                  lastMaintenance: "",
                  nextMaintenance: "",
                  responsible: "",
                });
              }
            }}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>编辑设施</DialogTitle>
                <DialogDescription>
                  修改设施信息
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>设施名称 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="如：1号楼电梯1"
                      value={facilityFormData.name}
                      onChange={(e) => handleFacilityFieldChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>设施类型 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="如：电梯、消防设施等"
                      value={facilityFormData.type}
                      onChange={(e) => handleFacilityFieldChange("type", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>设施位置 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="如：1号楼1单元"
                      value={facilityFormData.location}
                      onChange={(e) => handleFacilityFieldChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>状态 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="如：正常、维护中等"
                      value={facilityFormData.status}
                      onChange={(e) => handleFacilityFieldChange("status", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>上次维护时间</Label>
                    <Input
                      type="date"
                      value={facilityFormData.lastMaintenance}
                      onChange={(e) => handleFacilityFieldChange("lastMaintenance", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>下次维护时间</Label>
                    <Input
                      type="date"
                      value={facilityFormData.nextMaintenance}
                      onChange={(e) => handleFacilityFieldChange("nextMaintenance", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>负责人</Label>
                  <Input
                    placeholder="请输入负责人姓名"
                    value={facilityFormData.responsible}
                    onChange={(e) => handleFacilityFieldChange("responsible", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditFacilityOpen(false)}
                  disabled={facilitySubmitting}
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleFacilityUpdate}
                  disabled={facilitySubmitting}
                >
                  {facilitySubmitting ? "保存中..." : "保存"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 删除确认对话框 */}
          <Dialog
            open={isDeleteFacilityDialogOpen}
            onOpenChange={(open) => {
              setIsDeleteFacilityDialogOpen(open);
              if (!open) {
                setDeletingFacility(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认删除</DialogTitle>
                <DialogDescription>
                  您确定要删除这个设施吗？此操作无法撤销。
                </DialogDescription>
              </DialogHeader>
              {deletingFacility && (
                <div className="py-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{deletingFacility.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      类型: {deletingFacility.type} | 位置: {deletingFacility.location}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteFacilityDialogOpen(false)}
                  disabled={facilityDeleting}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteFacilityConfirm}
                  disabled={facilityDeleting}
                >
                  {facilityDeleting ? "删除中..." : "确认删除"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 停车管理 */}
        <TabsContent value="parking">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog
                open={isAddParkingOpen}
                onOpenChange={setIsAddParkingOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    添加停车位
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>添加新停车位</DialogTitle>
                    <DialogDescription>
                      填写停车位信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>车位号 <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="如：A-001"
                          value={parkingFormData.spaceNumber}
                          onChange={(e) => handleParkingFieldChange("spaceNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>区域</Label>
                        <Input
                          placeholder="如：地下车库A区"
                          value={parkingFormData.area}
                          onChange={(e) => handleParkingFieldChange("area", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>类型</Label>
                        <Input
                          placeholder="如：固定车位、临时车位"
                          value={parkingFormData.type}
                          onChange={(e) => handleParkingFieldChange("type", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>状态 <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="如：空闲、已租用、临停"
                          value={parkingFormData.status}
                          onChange={(e) => handleParkingFieldChange("status", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>业主</Label>
                        <Input
                          placeholder="请输入业主姓名"
                          value={parkingFormData.owner}
                          onChange={(e) => handleParkingFieldChange("owner", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>房屋</Label>
                        <Input
                          placeholder="如：1号楼101室"
                          value={parkingFormData.building}
                          onChange={(e) => handleParkingFieldChange("building", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>车牌号</Label>
                        <Input
                          placeholder="请输入车牌号"
                          value={parkingFormData.plateNumber}
                          onChange={(e) => handleParkingFieldChange("plateNumber", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>开始日期</Label>
                        <Input
                          type="date"
                          value={parkingFormData.startDate}
                          onChange={(e) => handleParkingFieldChange("startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>结束日期</Label>
                        <Input
                          type="date"
                          value={parkingFormData.endDate}
                          onChange={(e) => handleParkingFieldChange("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddParkingOpen(false)}
                      disabled={parkingSubmitting}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleParkingSubmit}
                      disabled={parkingSubmitting}
                    >
                      {parkingSubmitting ? "添加中..." : "添加"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Card>
            {parkingLoading ? (
              <div className="p-6">
                <div className="text-center text-gray-500">加载中...</div>
              </div>
            ) : filteredParkingSpaces.length === 0 ? (
              <div className="p-6">
                <div className="text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的停车位" : "暂无停车位数据"}
                </div>
              </div>
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>车位号</TableHead>
                  <TableHead>区域</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>业主</TableHead>
                  <TableHead>房屋</TableHead>
                  <TableHead>车牌号</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>租期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParkingSpaces.map((space) => (
                  <TableRow key={space.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        {space.spaceNumber}
                      </div>
                    </TableCell>
                    <TableCell>{space.area}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{space.type}</Badge>
                    </TableCell>
                    <TableCell>{space.owner}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {space.building}
                    </TableCell>
                    <TableCell>{space.plateNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          space.status === "已租用"
                            ? "default"
                            : space.status === "空闲"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {space.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {space.status === "已租用" && (
                        <div>
                          {space.startDate} 至 {space.endDate}
                        </div>
                      )}
                      {space.status === "临停" && <div>{space.startDate}</div>}
                      {space.status === "空闲" && <div>-</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditParking(space)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteParkingClick(space)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </Card>

          {/* 编辑停车位对话框 */}
          <Dialog
            open={isEditParkingOpen}
            onOpenChange={(open) => {
              setIsEditParkingOpen(open);
              if (!open) {
                setEditingParking(null);
                setParkingFormData({
                  spaceNumber: "",
                  area: "",
                  type: "",
                  owner: "",
                  building: "",
                  plateNumber: "",
                  status: "",
                  startDate: "",
                  endDate: "",
                });
              }
            }}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>编辑停车位</DialogTitle>
                <DialogDescription>
                  修改停车位信息
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>车位号 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="如：A-001"
                      value={parkingFormData.spaceNumber}
                      onChange={(e) => handleParkingFieldChange("spaceNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>区域</Label>
                    <Input
                      placeholder="如：地下车库A区"
                      value={parkingFormData.area}
                      onChange={(e) => handleParkingFieldChange("area", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>类型</Label>
                    <Input
                      placeholder="如：固定车位、临时车位"
                      value={parkingFormData.type}
                      onChange={(e) => handleParkingFieldChange("type", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>状态 <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="如：空闲、已租用、临停"
                      value={parkingFormData.status}
                      onChange={(e) => handleParkingFieldChange("status", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>业主</Label>
                    <Input
                      placeholder="请输入业主姓名"
                      value={parkingFormData.owner}
                      onChange={(e) => handleParkingFieldChange("owner", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>房屋</Label>
                    <Input
                      placeholder="如：1号楼101室"
                      value={parkingFormData.building}
                      onChange={(e) => handleParkingFieldChange("building", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>车牌号</Label>
                    <Input
                      placeholder="请输入车牌号"
                      value={parkingFormData.plateNumber}
                      onChange={(e) => handleParkingFieldChange("plateNumber", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>开始日期</Label>
                    <Input
                      type="date"
                      value={parkingFormData.startDate}
                      onChange={(e) => handleParkingFieldChange("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>结束日期</Label>
                    <Input
                      type="date"
                      value={parkingFormData.endDate}
                      onChange={(e) => handleParkingFieldChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditParkingOpen(false)}
                  disabled={parkingSubmitting}
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleParkingUpdate}
                  disabled={parkingSubmitting}
                >
                  {parkingSubmitting ? "保存中..." : "保存"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 删除确认对话框 */}
          <Dialog
            open={isDeleteParkingDialogOpen}
            onOpenChange={(open) => {
              setIsDeleteParkingDialogOpen(open);
              if (!open) {
                setDeletingParking(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认删除</DialogTitle>
                <DialogDescription>
                  您确定要删除这个停车位吗？此操作无法撤销。
                </DialogDescription>
              </DialogHeader>
              {deletingParking && (
                <div className="py-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">车位号: {deletingParking.spaceNumber}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      区域: {deletingParking.area || "-"} | 状态: {deletingParking.status}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteParkingDialogOpen(false)}
                  disabled={parkingDeleting}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteParkingConfirm}
                  disabled={parkingDeleting}
                >
                  {parkingDeleting ? "删除中..." : "确认删除"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

      
      </Tabs>
    </div>
  );
}
