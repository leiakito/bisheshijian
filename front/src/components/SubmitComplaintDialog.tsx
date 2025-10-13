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
import { useState } from "react";

interface SubmitComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitComplaintDialog({
  open,
  onOpenChange,
}: SubmitComplaintDialogProps) {
  const [selectedType, setSelectedType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟提交
    console.log("提交投诉");
    onOpenChange(false);
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
            <Label>投诉类型</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="请选择投诉类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noise">噪音问题</SelectItem>
                <SelectItem value="sanitation">环境卫生</SelectItem>
                <SelectItem value="parking">停车问题</SelectItem>
                <SelectItem value="service">服务态度</SelectItem>
                <SelectItem value="facility">设施损坏</SelectItem>
                <SelectItem value="suggestion">意见建议</SelectItem>
                <SelectItem value="other">其他问题</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>详细描述</Label>
            <Textarea
              placeholder="请详细描述您的投诉或建议..."
              rows={5}
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
            >
              取消
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              提交
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
