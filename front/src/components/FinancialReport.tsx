import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";

export function FinancialReport() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("1");

  // 月度收入数据
  const monthlyRevenue = [
    { month: "1月", revenue: 328500, expense: 125000, profit: 203500 },
    { month: "2月", revenue: 315000, expense: 118000, profit: 197000 },
    { month: "3月", revenue: 342000, expense: 132000, profit: 210000 },
    { month: "4月", revenue: 335000, expense: 128000, profit: 207000 },
    { month: "5月", revenue: 348000, expense: 135000, profit: 213000 },
    { month: "6月", revenue: 352000, expense: 138000, profit: 214000 },
    { month: "7月", revenue: 285000, expense: 120000, profit: 165000 },
    { month: "8月", revenue: 298000, expense: 115000, profit: 183000 },
    { month: "9月", revenue: 312000, expense: 125000, profit: 187000 },
    { month: "10月", revenue: 295000, expense: 118000, profit: 177000 },
    { month: "11月", revenue: 318000, expense: 128000, profit: 190000 },
    { month: "12月", revenue: 325000, expense: 130000, profit: 195000 },
  ];

  // 收入来源分布
  const revenueSource = [
    { name: "物业费", value: 180000, color: "#3b82f6" },
    { name: "停车费", value: 85000, color: "#10b981" },
    { name: "电梯费", value: 35000, color: "#f59e0b" },
    { name: "垃圾清运费", value: 18500, color: "#ef4444" },
    { name: "其他收入", value: 10000, color: "#8b5cf6" },
  ];

  // 支出分类
  const expenseCategory = [
    { category: "人员工资", amount: 65000, percent: "52%" },
    { category: "设施维护", amount: 28000, percent: "22%" },
    { category: "水电费", amount: 18000, percent: "14%" },
    { category: "清洁费用", amount: 10000, percent: "8%" },
    { category: "其他支出", amount: 4000, percent: "4%" },
  ];

  // 缴费率趋势
  const paymentRateTrend = [
    { month: "7月", rate: 85 },
    { month: "8月", rate: 87 },
    { month: "9月", rate: 89 },
    { month: "10月", rate: 86 },
    { month: "11月", rate: 88 },
    { month: "12月", rate: 90 },
    { month: "1月", rate: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部筛选 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025年</SelectItem>
                  <SelectItem value="2024">2024年</SelectItem>
                  <SelectItem value="2023">2023年</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {i + 1}月
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </Button>
        </div>
      </Card>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm">本月收入</p>
          </div>
          <h3 className="text-gray-900">¥328,500</h3>
          <p className="text-sm text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            较上月 +4.2%
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-500 text-sm">本月支出</p>
          </div>
          <h3 className="text-gray-900">¥125,000</h3>
          <p className="text-sm text-red-600 mt-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            较上月 +2.1%
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-500 text-sm">本月利润</p>
          </div>
          <h3 className="text-gray-900">¥203,500</h3>
          <p className="text-sm text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            较上月 +5.8%
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-gray-500 text-sm">缴费率</p>
          </div>
          <h3 className="text-gray-900">88%</h3>
          <p className="text-sm text-orange-600 mt-1">环比 -2%</p>
        </Card>
      </div>

      {/* 图表区域 */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">收支分析</TabsTrigger>
          <TabsTrigger value="source">收入来源</TabsTrigger>
          <TabsTrigger value="expense">支出明细</TabsTrigger>
          <TabsTrigger value="rate">缴费率</TabsTrigger>
        </TabsList>

        {/* 收支分析 */}
        <TabsContent value="revenue">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">年度收支趋势</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  name="收入"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill="#ef4444"
                  name="支出"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  fill="#10b981"
                  name="利润"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* 收入来源 */}
        <TabsContent value="source">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">收入来源分布</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={revenueSource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueSource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">收入来源明细</h3>
              <div className="space-y-4">
                {revenueSource.map((source) => (
                  <div
                    key={source.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-gray-900">{source.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900">¥{source.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        {((source.value / 328500) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <span className="text-gray-900">总计</span>
                  <span className="text-blue-600">
                    ¥{revenueSource.reduce((sum, s) => sum + s.value, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 支出明细 */}
        <TabsContent value="expense">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">支出分类统计</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>支出类别</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>占比</TableHead>
                  <TableHead>环比</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategory.map((expense) => (
                  <TableRow key={expense.category}>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-red-600">
                      ¥{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: expense.percent }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {expense.percent}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">+2.3%</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 缴费率 */}
        <TabsContent value="rate">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">缴费率趋势</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={paymentRateTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[80, 95]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="缴费率 (%)"
                  dot={{ fill: "#3b82f6", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
