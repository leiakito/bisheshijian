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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, X } from "lucide-react";

interface AdvancedSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchType: string;
}

export function AdvancedSearch({
  open,
  onOpenChange,
  searchType,
}: AdvancedSearchProps) {
  const handleSearch = () => {
    // 模拟高级搜索
    console.log("执行高级搜索");
    onOpenChange(false);
  };

  const handleReset = () => {
    // 重置所有搜索条件
    console.log("重置搜索条件");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>高级搜索</DialogTitle>
          <DialogDescription>
            设置更多搜索条件以精确查找数据
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {searchType === "resident" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>业主姓名</Label>
                  <Input placeholder="请输入业主姓名" />
                </div>
                <div className="space-y-2">
                  <Label>手机号</Label>
                  <Input placeholder="请输入手机号" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>楼栋</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择楼栋" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1号楼</SelectItem>
                      <SelectItem value="2">2号楼</SelectItem>
                      <SelectItem value="3">3号楼</SelectItem>
                      <SelectItem value="4">4号楼</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>单元</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择单元" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1单元</SelectItem>
                      <SelectItem value="2">2单元</SelectItem>
                      <SelectItem value="3">3单元</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>房号</Label>
                  <Input placeholder="请输入房号" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>入住状态</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="occupied">已入住</SelectItem>
                      <SelectItem value="vacant">空置</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>房屋面积</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="最小" type="number" />
                    <span className="text-gray-500">-</span>
                    <Input placeholder="最大" type="number" />
                  </div>
                </div>
              </div>
            </>
          )}

          {searchType === "fee" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>业主姓名</Label>
                  <Input placeholder="请输入业主姓名" />
                </div>
                <div className="space-y-2">
                  <Label>房号</Label>
                  <Input placeholder="请输入房号" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>费用类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择费用类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="property">物业费</SelectItem>
                      <SelectItem value="parking">停车费</SelectItem>
                      <SelectItem value="elevator">电梯费</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>缴费状态</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="paid">已缴费</SelectItem>
                      <SelectItem value="unpaid">待缴费</SelectItem>
                      <SelectItem value="overdue">已逾期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>账单金额</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="最小金额" type="number" />
                    <span className="text-gray-500">-</span>
                    <Input placeholder="最大金额" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>账期</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择账期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-01">2025年1月</SelectItem>
                      <SelectItem value="2024-12">2024年12月</SelectItem>
                      <SelectItem value="2024-11">2024年11月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {searchType === "repair" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>工单号</Label>
                  <Input placeholder="请输入工单号" />
                </div>
                <div className="space-y-2">
                  <Label>业主姓名</Label>
                  <Input placeholder="请输入业主姓名" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>报修类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="water">水电维修</SelectItem>
                      <SelectItem value="elevator">电梯维护</SelectItem>
                      <SelectItem value="door">门禁维修</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>工单状态</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="assigned">已派单</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>优先级</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                      <SelectItem value="normal">普通</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>维修人员</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择人员" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="wang">王师傅</SelectItem>
                      <SelectItem value="li">李师傅</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>提交时间范围</Label>
                <div className="flex items-center gap-2">
                  <Input type="date" />
                  <span className="text-gray-500">至</span>
                  <Input type="date" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            <X className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            搜索
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
