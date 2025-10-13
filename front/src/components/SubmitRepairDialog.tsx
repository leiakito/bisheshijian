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
import { useState } from "react";

interface SubmitRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitRepairDialog({
  open,
  onOpenChange,
}: SubmitRepairDialogProps) {
  const [selectedType, setSelectedType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟提交
    console.log("提交报修");
    onOpenChange(false);
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
          <div className="space-y-2">
            <Label>报修类型</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="请选择报修类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water">水管漏水</SelectItem>
                <SelectItem value="electric">电路故障</SelectItem>
                <SelectItem value="door">门窗损坏</SelectItem>
                <SelectItem value="light">灯具维修</SelectItem>
                <SelectItem value="toilet">卫浴维修</SelectItem>
                <SelectItem value="other">其他问题</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>问题描述</Label>
            <Textarea
              placeholder="请详细描述遇到的问题..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>联系电话</Label>
            <Input
              type="tel"
              placeholder="请输入您的联系电话"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>上传照片（可选）</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">点击上传照片</p>
              <p className="text-xs text-gray-400 mt-1">
                支持 JPG、PNG 格式，最多3张
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              提交申请
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
