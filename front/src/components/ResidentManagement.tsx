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
import { Search, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  getResidents,
  createResident,
  updateResident,
  deleteResident,
} from "../services/residentService";
import type { Resident, ResidentRequest } from "../types/api";
import { toast } from "sonner";

export function ResidentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<ResidentRequest>({
    name: "",
    phone: "",
    idCard: "",
    building: "",
    unit: "",
    room: "",
    residenceType: "OWNER",
    moveInDate: new Date().toISOString().split("T")[0],
    status: "OCCUPIED",
    emergencyContact: "",
    emergencyPhone: "",
    remark: "",
  });

  useEffect(() => {
    loadResidents();
  }, [searchQuery]);

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResidents({
        keyword: searchQuery || undefined,
        page: 0,
        size: 100,
      });
      setResidents(data.content);
    } catch (err) {
      console.error("Failed to load residents:", err);
      setError(err instanceof Error ? err.message : "加载住户数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await createResident(formData);
      toast.success("新增业主成功");
      setIsAddDialogOpen(false);
      resetForm();
      loadResidents();
    } catch (err) {
      console.error("Failed to create resident:", err);
      toast.error(err instanceof Error ? err.message : "新增业主失败");
    }
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setFormData({
      name: resident.name,
      phone: resident.phone,
      idCard: resident.idCard,
      building: resident.building,
      unit: resident.unit,
      room: resident.room,
      residenceType: resident.residenceType,
      moveInDate: resident.moveInDate,
      status: resident.status,
      emergencyContact: resident.emergencyContact || "",
      emergencyPhone: resident.emergencyPhone || "",
      remark: resident.remark || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingResident) return;

    try {
      await updateResident(editingResident.id, formData);
      toast.success("更新业主信息成功");
      setIsEditDialogOpen(false);
      resetForm();
      loadResidents();
    } catch (err) {
      console.error("Failed to update resident:", err);
      toast.error(err instanceof Error ? err.message : "更新业主信息失败");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除业主"${name}"吗？`)) return;

    try {
      await deleteResident(id);
      toast.success("删除业主成功");
      loadResidents();
    } catch (err) {
      console.error("Failed to delete resident:", err);
      toast.error(err instanceof Error ? err.message : "删除业主失败");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      idCard: "",
      building: "",
      unit: "",
      room: "",
      residenceType: "OWNER",
      moveInDate: new Date().toISOString().split("T")[0],
      status: "OCCUPIED",
      emergencyContact: "",
      emergencyPhone: "",
      remark: "",
    });
    setEditingResident(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OCCUPIED":
        return <Badge className="bg-green-100 text-green-700">已入住</Badge>;
      case "VACANT":
        return <Badge className="bg-gray-100 text-gray-700">空置</Badge>;
      case "RENTED":
        return <Badge className="bg-blue-100 text-blue-700">出租</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索业主姓名、房号、手机号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                新增业主
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增业主信息</DialogTitle>
                <DialogDescription>请填写业主的基本信息和房屋信息</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>业主姓名 *</Label>
                    <Input
                      placeholder="请输入业主姓名"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>联系电话 *</Label>
                    <Input
                      placeholder="请输入手机号"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>身份证号 *</Label>
                  <Input
                    placeholder="请输入身份证号"
                    value={formData.idCard}
                    onChange={(e) =>
                      setFormData({ ...formData, idCard: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>楼栋 *</Label>
                    <Input
                      placeholder="1号楼"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({ ...formData, building: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>单元 *</Label>
                    <Input
                      placeholder="2单元"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>房号 *</Label>
                    <Input
                      placeholder="301"
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>居住类型</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.residenceType}
                      onChange={(e) =>
                        setFormData({ ...formData, residenceType: e.target.value })
                      }
                    >
                      <option value="OWNER">业主</option>
                      <option value="TENANT">租户</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>入住日期</Label>
                    <Input
                      type="date"
                      value={formData.moveInDate}
                      onChange={(e) =>
                        setFormData({ ...formData, moveInDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>紧急联系人</Label>
                    <Input
                      placeholder="请输入紧急联系人"
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>紧急联系电话</Label>
                    <Input
                      placeholder="请输入紧急联系电话"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Input
                    placeholder="请输入备注信息"
                    value={formData.remark}
                    onChange={(e) =>
                      setFormData({ ...formData, remark: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAdd}
                >
                  确定
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* 编辑对话框 */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑业主信息</DialogTitle>
            <DialogDescription>修改业主的基本信息和房屋信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>业主姓名 *</Label>
                <Input
                  placeholder="请输入业主姓名"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>联系电话 *</Label>
                <Input
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>身份证号 *</Label>
              <Input
                placeholder="请输入身份证号"
                value={formData.idCard}
                onChange={(e) =>
                  setFormData({ ...formData, idCard: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>楼栋 *</Label>
                <Input
                  placeholder="1号楼"
                  value={formData.building}
                  onChange={(e) =>
                    setFormData({ ...formData, building: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>单元 *</Label>
                <Input
                  placeholder="2单元"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>房号 *</Label>
                <Input
                  placeholder="301"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>居住类型</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.residenceType}
                  onChange={(e) =>
                    setFormData({ ...formData, residenceType: e.target.value })
                  }
                >
                  <option value="OWNER">业主</option>
                  <option value="TENANT">租户</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="OCCUPIED">已入住</option>
                  <option value="VACANT">空置</option>
                  <option value="RENTED">出租</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>入住日期</Label>
              <Input
                type="date"
                value={formData.moveInDate}
                onChange={(e) =>
                  setFormData({ ...formData, moveInDate: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>紧急联系人</Label>
                <Input
                  placeholder="请输入紧急联系人"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>紧急联系电话</Label>
                <Input
                  placeholder="请输入紧急联系电话"
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyPhone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>备注</Label>
              <Input
                placeholder="请输入备注信息"
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdate}
            >
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 标签页内容 */}
      <Tabs defaultValue="residents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="residents">业主信息</TabsTrigger>
        </TabsList>

        {/* 业主信息 */}
        <TabsContent value="residents">
          <Card>
            {loading ? (
              <div className="p-12 text-center text-gray-500">加载中...</div>
            ) : error ? (
              <div className="p-12">
                <div className="flex items-center justify-center gap-3 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  <span>{error}</span>
                </div>
              </div>
            ) : residents.length === 0 ? (
              <div className="p-12 text-center text-gray-500">暂无数据</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>业主姓名</TableHead>
                    <TableHead>联系电话</TableHead>
                    <TableHead>房屋地址</TableHead>
                    <TableHead>居住类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>入住日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {residents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>{resident.name}</TableCell>
                      <TableCell>{resident.phone}</TableCell>
                      <TableCell>
                        {resident.building} {resident.unit} {resident.room}
                      </TableCell>
                      <TableCell>
                        {resident.residenceType === "OWNER" ? "业主" : "租户"}
                      </TableCell>
                      <TableCell>{getStatusBadge(resident.status)}</TableCell>
                      <TableCell>{resident.moveInDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(resident)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(resident.id, resident.name)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
