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
import { Search, Plus, Download, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom";

export function FeeManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const feeStats = [
    {
      label: "本月应收",
      value: "¥458,000",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "本月实收",
      value: "¥328,500",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "欠费总额",
      value: "¥129,500",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "缴费率",
      value: "72%",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const bills = [
    {
      id: "1",
      owner: "张三",
      building: "1号楼2单元301",
      type: "物业费",
      amount: 2400,
      period: "2025年1月",
      status: "已缴费",
      payTime: "2025-01-05 14:23",
      payMethod: "微信支付",
    },
    {
      id: "2",
      owner: "李四",
      building: "1号楼2单元302",
      type: "物业费",
      amount: 1900,
      period: "2025年1月",
      status: "待缴费",
      payTime: "-",
      payMethod: "-",
    },
    {
      id: "3",
      owner: "王五",
      building: "2号楼1单元501",
      type: "物业费+停车费",
      amount: 3200,
      period: "2025年1月",
      status: "已缴费",
      payTime: "2025-01-03 10:15",
      payMethod: "支付宝",
    },
    {
      id: "4",
      owner: "赵六",
      building: "3号楼3单元201",
      type: "物业费",
      amount: 1760,
      period: "2025年1月",
      status: "逾期",
      payTime: "-",
      payMethod: "-",
    },
  ];

  const feeItems = [
    {
      id: "1",
      name: "物业费",
      unit: "元/㎡/月",
      price: 2.0,
      description: "基础物业服务费用",
      status: "启用",
    },
    {
      id: "2",
      name: "停车费",
      unit: "元/月",
      price: 300,
      description: "固定车位月租费",
      status: "启用",
    },
    {
      id: "3",
      name: "电梯费",
      unit: "元/月",
      price: 50,
      description: "电梯运行维护费",
      status: "启用",
    },
    {
      id: "4",
      name: "垃圾清运费",
      unit: "元/月",
      price: 20,
      description: "生活垃圾清运费用",
      status: "启用",
    },
  ];

  const paymentRecords = [
    {
      id: "1",
      orderNo: "202501051423001",
      owner: "张三",
      building: "1号楼2单元301",
      amount: 2400,
      type: "物业费",
      method: "微信支付",
      time: "2025-01-05 14:23:15",
      status: "成功",
    },
    {
      id: "2",
      orderNo: "202501031015002",
      owner: "王五",
      building: "2号楼1单元501",
      amount: 3200,
      type: "物业费+停车费",
      method: "支付宝",
      time: "2025-01-03 10:15:42",
      status: "成功",
    },
    {
      id: "3",
      orderNo: "202501021120003",
      owner: "孙七",
      building: "4号楼1单元102",
      amount: 1600,
      type: "物业费",
      method: "现金",
      time: "2025-01-02 11:20:30",
      status: "成功",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 费用统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {feeStats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className={`${stat.bg} p-3 rounded-lg inline-block mb-3`}>
              <p className={`${stat.color}`}>{stat.label}</p>
            </div>
            <h3 className={`${stat.color}`}>{stat.value}</h3>
            {stat.label === "缴费率" && (
              <Progress value={72} className="mt-3" />
            )}
          </Card>
        ))}
      </div>

      {/* 操作栏 */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索业主、房号、订单号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/financial-report")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              财务报表
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              生成账单
            </Button>
          </div>
        </div>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="bills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bills">账单管理</TabsTrigger>
          <TabsTrigger value="records">缴费记录</TabsTrigger>
          <TabsTrigger value="items">收费项目</TabsTrigger>
        </TabsList>

        {/* 账单管理 */}
        <TabsContent value="bills">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>业主</TableHead>
                  <TableHead>房屋地址</TableHead>
                  <TableHead>费用类型</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>账期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>缴费时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{bill.owner}</TableCell>
                    <TableCell>{bill.building}</TableCell>
                    <TableCell>{bill.type}</TableCell>
                    <TableCell className="text-green-600">
                      ¥{bill.amount}
                    </TableCell>
                    <TableCell>{bill.period}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bill.status === "已缴费"
                            ? "default"
                            : bill.status === "逾期"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {bill.status === "已缴费" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {bill.status === "待缴费" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {bill.payTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          详情
                        </Button>
                        {bill.status !== "已缴费" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                          >
                            催缴
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 缴费记录 */}
        <TabsContent value="records">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>业主</TableHead>
                  <TableHead>房屋地址</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>费用类型</TableHead>
                  <TableHead>支付方式</TableHead>
                  <TableHead>缴费时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-sm text-gray-500">
                      {record.orderNo}
                    </TableCell>
                    <TableCell>{record.owner}</TableCell>
                    <TableCell>{record.building}</TableCell>
                    <TableCell className="text-green-600">
                      ¥{record.amount}
                    </TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.method}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {record.time}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 收费项目 */}
        <TabsContent value="items">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>单价</TableHead>
                  <TableHead>计费单位</TableHead>
                  <TableHead>说明</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-green-600">
                      ¥{item.price}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-gray-500">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          停用
                        </Button>
                      </div>
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
