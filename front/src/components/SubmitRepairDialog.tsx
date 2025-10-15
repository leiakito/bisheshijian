import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import { createRepairOrder } from "../services/repairService";

interface SubmitRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPAIR_TYPES = [
  { value: "水管漏水", label: "水管漏水" },
  { value: "电路故障", label: "电路故障" },
  { value: "门窗损坏", label: "门窗损坏" },
  { value: "灯具维修", label: "灯具维修" },
  { value: "卫浴维修", label: "卫浴维修" },
  { value: "电梯故障", label: "电梯故障" },
  { value: "门禁损坏", label: "门禁损坏" },
  { value: "其他问题", label: "其他问题" },
];

export function SubmitRepairDialog({
  open,
  onOpenChange,
}: SubmitRepairDialogProps) {
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phone: string;
    building: string;
    unit: string;
    roomNumber: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      // 对话框打开时加载用户信息
      loadUserInfo();
    }
  }, [open]);

  const loadUserInfo = async () => {
    try {
      const user = await getCurrentUser();
      if (user.resident) {
        setUserInfo({
          name: user.resident.name,
          phone: user.resident.phone,
          building: user.resident.building,
          unit: user.resident.unit,
          roomNumber: user.resident.roomNumber,
        });
        setPhone(user.resident.phone);
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !description || !phone || !userInfo) {
      alert("请填写完整信息");
      return;
    }

    setLoading(true);

    try {
      await createRepairOrder({
        ownerName: userInfo.name,
        phone: phone,
        building: userInfo.building,
        unit: userInfo.unit,
        roomNumber: userInfo.roomNumber,
        type: selectedType,
        description: description,
        priority: "NORMAL",
      });

      // 重置表单
      setSelectedType("");
      setDescription("");
      setPhone(userInfo.phone);

      alert("报修申请提交成功！");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit repair:", error);
      alert("提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>提交报修申请</DialogTitle>
          <DialogDescription>
            请详细描述问题，我们会尽快为您安排维修
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {userInfo && (
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">报修地址：</span>
                {userInfo.building} {userInfo.unit} {userInfo.roomNumber}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>报修类型 *</Label>
            <Select value={selectedType} onValueChange={setSelectedType} required>
              <SelectTrigger>
                <SelectValue placeholder="请选择报修类型" />
              </SelectTrigger>
              <SelectContent>
                {REPAIR_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>问题描述 *</Label>
            <Textarea
              placeholder="请详细描述遇到的问题..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>联系电话 *</Label>
            <Input
              type="tel"
              placeholder="请输入您的联系电话"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "提交中..." : "提交申请"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
