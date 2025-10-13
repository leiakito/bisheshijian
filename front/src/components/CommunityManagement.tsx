import { useState, useEffect } from "react";
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
import type { Announcement, AnnouncementRequest } from "../types/api";

export function CommunityManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<AnnouncementRequest>({
    title: "",
    content: "",
    targetScope: "",
  });

  // 加载公告列表
  useEffect(() => {
    loadAnnouncements();
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

  const facilities = [
    {
      id: "1",
      name: "1号楼电梯1",
      type: "电梯",
      location: "1号楼1单元",
      status: "正常",
      lastMaintenance: "2024-12-15",
      nextMaintenance: "2025-02-15",
      responsible: "李师傅",
    },
    {
      id: "2",
      name: "1号楼电梯2",
      type: "电梯",
      location: "1号楼2单元",
      status: "正常",
      lastMaintenance: "2024-12-15",
      nextMaintenance: "2025-02-15",
      responsible: "李师傅",
    },
    {
      id: "3",
      name: "东门消防栓",
      type: "消防设施",
      location: "东门入口",
      status: "正常",
      lastMaintenance: "2024-11-20",
      nextMaintenance: "2025-01-20",
      responsible: "安保部",
    },
    {
      id: "4",
      name: "儿童游乐区",
      type: "公共设施",
      location: "中心花园",
      status: "维护中",
      lastMaintenance: "2025-01-05",
      nextMaintenance: "2025-03-05",
      responsible: "王师傅",
    },
  ];

  const parkingSpaces = [
    {
      id: "1",
      spaceNumber: "A-101",
      area: "A区",
      type: "固定车位",
      owner: "张三",
      building: "1号楼2单元301",
      plateNumber: "京A12345",
      status: "已租用",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
    },
    {
      id: "2",
      spaceNumber: "A-102",
      area: "A区",
      type: "固定车位",
      owner: "李四",
      building: "1号楼2单元302",
      plateNumber: "京B67890",
      status: "已租用",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
    },
    {
      id: "3",
      spaceNumber: "A-103",
      area: "A区",
      type: "固定车位",
      owner: "-",
      building: "-",
      plateNumber: "-",
      status: "空闲",
      startDate: "-",
      endDate: "-",
    },
    {
      id: "4",
      spaceNumber: "B-201",
      area: "B区",
      type: "临时车位",
      owner: "-",
      building: "-",
      plateNumber: "京C99999",
      status: "临停",
      startDate: "2025-01-11 08:30",
      endDate: "-",
    },
  ];

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
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements">公告通知</TabsTrigger>
          <TabsTrigger value="facilities">公共设施</TabsTrigger>
          <TabsTrigger value="parking">停车管理</TabsTrigger>
          <TabsTrigger value="patrol">巡更管理</TabsTrigger>
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
            ) : announcements.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-500">暂无公告</div>
              </Card>
            ) : (
              announcements.map((announcement) => (
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
          <Card>
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
                {facilities.map((facility) => (
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
                      {facility.lastMaintenance}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {facility.nextMaintenance}
                    </TableCell>
                    <TableCell>{facility.responsible}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          维护记录
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 停车管理 */}
        <TabsContent value="parking">
          <Card>
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
                {parkingSpaces.map((space) => (
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
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 巡更管理 */}
        <TabsContent value="patrol">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>班次</TableHead>
                  <TableHead>保安</TableHead>
                  <TableHead>巡更路线</TableHead>
                  <TableHead>打卡点</TableHead>
                  <TableHead>完成情况</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrols.map((patrol) => (
                  <TableRow key={patrol.id}>
                    <TableCell>{patrol.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{patrol.shift}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        {patrol.guard}
                      </div>
                    </TableCell>
                    <TableCell>{patrol.route}</TableCell>
                    <TableCell>{patrol.checkpoints}个</TableCell>
                    <TableCell>
                      <span
                        className={
                          patrol.completed === patrol.checkpoints
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {patrol.completed}/{patrol.checkpoints}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patrol.status === "已完成" ? "default" : "secondary"
                        }
                      >
                        {patrol.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {patrol.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
