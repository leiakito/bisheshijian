import { useState } from "react";
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
import { Search, Eye, Star, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepair, setSelectedRepair] = useState<any>(null);

  const repairs = [
    {
      id: "R20250105001",
      owner: "张三",
      building: "1号楼2单元301",
      phone: "138****1234",
      type: "水管漏水",
      category: "水电维修",
      description: "厨房水管接口处漏水，需要紧急维修",
      status: "处理中",
      priority: "紧急",
      submitTime: "2025-01-05 08:30",
      assignee: "王师傅",
      images: ["image1.jpg", "image2.jpg"],
    },
    {
      id: "R20250105002",
      owner: "李四",
      building: "1号楼2单元302",
      phone: "139****5678",
      type: "电梯故障",
      category: "电梯维护",
      description: "电梯按键失灵，无法正常使用",
      status: "已派单",
      priority: "紧急",
      submitTime: "2025-01-05 06:45",
      assignee: "李师傅",
      images: ["image3.jpg"],
    },
    {
      id: "R20250104001",
      owner: "王五",
      building: "2号楼1单元501",
      phone: "136****9012",
      type: "门禁损坏",
      category: "门禁维修",
      description: "单元门禁刷卡无反应",
      status: "待处理",
      priority: "普通",
      submitTime: "2025-01-04 16:20",
      assignee: "-",
      images: [],
    },
    {
      id: "R20250103001",
      owner: "赵六",
      building: "3号楼3单元201",
      phone: "137****3456",
      type: "灯具维修",
      category: "水电维修",
      description: "客厅吸顶灯不亮",
      status: "已完成",
      priority: "普通",
      submitTime: "2025-01-03 14:10",
      assignee: "王师傅",
      images: [],
      rating: 5,
      feedback: "服务很好，维修及时",
    },
  ];

  const complaints = [
    {
      id: "C20250105001",
      owner: "张三",
      building: "1号楼2单元301",
      phone: "138****1234",
      type: "噪音投诉",
      content: "楼上住户深夜装修，影响休息",
      status: "处理中",
      submitTime: "2025-01-05 09:15",
      handler: "客服小李",
    },
    {
      id: "C20250104001",
      owner: "孙七",
      building: "4号楼1单元102",
      phone: "135****7890",
      type: "环境卫生",
      content: "小区垃圾桶未及时清理",
      status: "已处理",
      submitTime: "2025-01-04 10:30",
      handler: "客服小王",
      reply: "已安排保洁人员及时清理，并加强巡查频次",
    },
    {
      id: "C20250103001",
      owner: "周八",
      building: "2号楼3单元405",
      phone: "134****2345",
      type: "停车问题",
      content: "有车辆占用消防通道",
      status: "已处理",
      submitTime: "2025-01-03 15:45",
      handler: "保安队长",
      reply: "已通知车主移走车辆，并加强巡查",
    },
  ];

  const statusColors: Record<string, string> = {
    待处理: "secondary",
    已派单: "default",
    处理中: "default",
    已完成: "default",
    已处理: "default",
  };

  const priorityColors: Record<string, string> = {
    紧急: "destructive",
    普通: "secondary",
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-gray-500 text-sm">待处理报修</p>
          <h3 className="text-gray-900 mt-2">23</h3>
          <p className="text-sm text-gray-500 mt-1">需要尽快处理</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">处理中报修</p>
          <h3 className="text-gray-900 mt-2">15</h3>
          <p className="text-sm text-gray-500 mt-1">正在维修中</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">待处理投诉</p>
          <h3 className="text-gray-900 mt-2">8</h3>
          <p className="text-sm text-gray-500 mt-1">需要及时响应</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">本月完成</p>
          <h3 className="text-gray-900 mt-2">156</h3>
          <p className="text-sm text-green-600 mt-1">满意度 98%</p>
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
          <Card>
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
                {repairs.map((repair) => (
                  <TableRow key={repair.id}>
                    <TableCell className="text-sm text-gray-500">
                      {repair.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{repair.owner}</div>
                        <div className="text-sm text-gray-500">
                          {repair.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{repair.building}</TableCell>
                    <TableCell>
                      <div>
                        <div>{repair.type}</div>
                        <div className="text-xs text-gray-500">
                          {repair.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityColors[repair.priority] as any}>
                        {repair.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[repair.status] as any}>
                        {repair.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{repair.assignee}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {repair.submitTime}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRepair(repair)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>报修详情 - {repair.id}</DialogTitle>
                            <DialogDescription>
                              查看和处理报修工单
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>业主信息</Label>
                                <p className="mt-1">
                                  {repair.owner} - {repair.phone}
                                </p>
                              </div>
                              <div>
                                <Label>房屋地址</Label>
                                <p className="mt-1">{repair.building}</p>
                              </div>
                            </div>
                            <div>
                              <Label>报修类型</Label>
                              <p className="mt-1">
                                {repair.type} ({repair.category})
                              </p>
                            </div>
                            <div>
                              <Label>问题描述</Label>
                              <p className="mt-1 text-gray-600">
                                {repair.description}
                              </p>
                            </div>
                            {repair.images.length > 0 && (
                              <div>
                                <Label>现场照片</Label>
                                <div className="flex gap-2 mt-2">
                                  {repair.images.map((img, idx) => (
                                    <div
                                      key={idx}
                                      className="w-24 h-24 bg-gray-100 rounded-lg"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>优先级</Label>
                                <Badge
                                  className="mt-1"
                                  variant={
                                    priorityColors[repair.priority] as any
                                  }
                                >
                                  {repair.priority}
                                </Badge>
                              </div>
                              <div>
                                <Label>当前状态</Label>
                                <Badge
                                  className="mt-1"
                                  variant={statusColors[repair.status] as any}
                                >
                                  {repair.status}
                                </Badge>
                              </div>
                            </div>
                            {repair.status === "已完成" && repair.rating && (
                              <div>
                                <Label>业主评价</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(repair.rating)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-gray-600">
                                    {repair.feedback}
                                  </span>
                                </div>
                              </div>
                            )}
                            {repair.status === "待处理" && (
                              <div className="flex gap-2 pt-4">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                  派单
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 投诉建议 */}
        <TabsContent value="complaints">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工单号</TableHead>
                  <TableHead>业主</TableHead>
                  <TableHead>房屋</TableHead>
                  <TableHead>投诉类型</TableHead>
                  <TableHead>内容</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>处理人</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="text-sm text-gray-500">
                      {complaint.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{complaint.owner}</div>
                        <div className="text-sm text-gray-500">
                          {complaint.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{complaint.building}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{complaint.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {complaint.content}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[complaint.status] as any}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{complaint.handler}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {complaint.submitTime}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              投诉详情 - {complaint.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>业主信息</Label>
                              <p className="mt-1">
                                {complaint.owner} - {complaint.building}
                              </p>
                            </div>
                            <div>
                              <Label>投诉内容</Label>
                              <p className="mt-1 text-gray-600">
                                {complaint.content}
                              </p>
                            </div>
                            {complaint.reply && (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <Label>处理回复</Label>
                                <p className="mt-1 text-gray-600">
                                  {complaint.reply}
                                </p>
                              </div>
                            )}
                            {complaint.status === "处理中" && (
                              <div>
                                <Label>处理意见</Label>
                                <Textarea
                                  placeholder="请输入处理意见和回复..."
                                  className="mt-2"
                                />
                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                                  提交回复
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
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
