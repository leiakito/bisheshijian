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
import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import { createComplaint } from "../services/complaintService";

interface SubmitComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMPLAINT_TYPES = [
  { value: "噪音问题", label: "噪音问题" },
  { value: "环境卫生", label: "环境卫生" },
  { value: "停车问题", label: "停车问题" },
  { value: "服务态度", label: "服务态度" },
  { value: "设施损坏", label: "设施损坏" },
  { value: "意见建议", label: "意见建议" },
  { value: "其他问题", label: "其他问题" },
];

export function SubmitComplaintDialog({
  open,
  onOpenChange,
}: SubmitComplaintDialogProps) {
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (open) {
      loadUserInfo();
    }
  }, [open]);

  const loadUserInfo = async () => {
    try {
      const user = await getCurrentUser();
      if (user.resident) {
        setUserName(user.resident.name);
        setPhone(user.resident.phone);
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !description || !phone || !userName) {
      alert("请填写完整信息");
      return;
    }

    setLoading(true);

    try {
      await createComplaint({
        ownerName: userName,
        phone: phone,
        type: selectedType,
        description: description,
      });

      // 重置表单
      setSelectedType("");
      setDescription("");

      alert("投诉建议提交成功！我们会在24小时内给您回复。");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      alert("提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>提交投诉建议</DialogTitle>
          <DialogDescription>
            您的意见对我们很重要，我们会认真处理
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>投诉类型 *</Label>
            <Select value={selectedType} onValueChange={setSelectedType} required>
              <SelectTrigger>
                <SelectValue placeholder="请选择投诉类型" />
              </SelectTrigger>
              <SelectContent>
                {COMPLAINT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>详细描述 *</Label>
            <Textarea
              placeholder="请详细描述您的投诉或建议..."
              rows={5}
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              我们承诺在24小时内给您回复，感谢您的理解与支持！
            </p>
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
              {loading ? "提交中..." : "提交"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
