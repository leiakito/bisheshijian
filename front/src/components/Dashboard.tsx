import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  Users,
  DollarSign,
  Wrench,
  AlertCircle,
  TrendingUp,
  Home,
  Car,
  Bell,
} from "lucide-react";
import { Progress } from "./ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { getDashboardSummary } from "../services/dashboardService";
import type { DashboardSummary } from "../types/api";

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err instanceof Error ? err.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  };
  // 如果加载中，显示骨架屏
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 如果出错，显示错误信息
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-red-900 font-medium">加载失败</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 使用后端数据构建统计卡片
  const stats = [
    {
      title: "总住户数",
      value: summary?.totalResidents.toString() || "0",
      change: "+12",
      icon: Users,
      color: "bg-blue-500",
      trend: "本月新增",
    },
    {
      title: "本月收入",
      value: `¥${summary?.monthlyIncome.toLocaleString() || "0"}`,
      change: "+15.3%",
      icon: DollarSign,
      color: "bg-green-500",
      trend: "较上月",
    },
    {
      title: "待处理报修",
      value: summary?.pendingRepairs.toString() || "0",
      change: "-5",
      icon: Wrench,
      color: "bg-orange-500",
      trend: "较昨日",
    },
    {
      title: "待处理投诉",
      value: summary?.pendingComplaints.toString() || "0",
      change: "+2",
      icon: AlertCircle,
      color: "bg-red-500",
      trend: "较昨日",
    },
  ];

  const quickStats = [
    {
      label: "入住率",
      value: `${summary?.occupancyRate.toFixed(0) || "0"}%`,
      icon: Home
    },
    {
      label: "缴费率",
      value: `${summary?.paymentRate.toFixed(0) || "0"}%`,
      icon: TrendingUp
    },
    { label: "车位使用", value: "456/520", icon: Car },
  ];

  const recentRepairs = [
    {
      id: "1",
      building: "1号楼",
      unit: "2单元301",
      type: "水管漏水",
      status: "处理中",
      time: "2小时前",
    },
    {
      id: "2",
      building: "3号楼",
      unit: "1单元501",
      type: "电梯故障",
      status: "已派单",
      time: "5小时前",
    },
    {
      id: "3",
      building: "2号楼",
      unit: "3单元201",
      type: "门禁损坏",
      status: "待处理",
      time: "1天前",
    },
    {
      id: "4",
      building: "4号楼",
      unit: "2单元402",
      type: "灯具维修",
      status: "已完成",
      time: "2天前",
    },
  ];

  const announcements = [
    {
      id: "1",
      title: "本月物业费缴纳通知",
      date: "2025-01-10",
      type: "缴费通知",
    },
    {
      id: "2",
      title: "春节期间服务安排",
      date: "2025-01-08",
      type: "重要通知",
    },
    {
      id: "3",
      title: "消防设施定期检查",
      date: "2025-01-05",
      type: "日常公告",
    },
  ];

  // 收入趋势数据
  const revenueData = [
    { month: "7月", revenue: 285000, target: 300000 },
    { month: "8月", revenue: 298000, target: 300000 },
    { month: "9月", revenue: 312000, target: 310000 },
    { month: "10月", revenue: 295000, target: 310000 },
    { month: "11月", revenue: 318000, target: 320000 },
    { month: "12月", revenue: 325000, target: 320000 },
    { month: "1月", revenue: 328500, target: 330000 },
  ];

  // 报修类型统计
  const repairTypeData = [
    { type: "水电维修", count: 45, color: "#3b82f6" },
    { type: "电梯维护", count: 28, color: "#10b981" },
    { type: "门禁维修", count: 18, color: "#f59e0b" },
    { type: "公共设施", count: 12, color: "#ef4444" },
    { type: "其他", count: 8, color: "#8b5cf6" },
  ];

  // 缴费情况统计
  const paymentData = [
    { name: "已缴费", value: 912, color: "#10b981" },
    { name: "待缴费", value: 245, color: "#f59e0b" },
    { name: "已逾期", value: 111, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-gray-900 mt-2">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span
                      className={
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    {stat.trend}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <h4 className="text-gray-900">{item.value}</h4>
                </div>
              </div>
              {item.label === "缴费率" && (
                <Progress value={summary?.paymentRate || 0} className="mt-4" />
              )}
            </Card>
          );
        })}
      </div>

      {/* 数据图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收入趋势图 */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">收入趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="实际收入"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="目标收入"
                dot={{ fill: "#10b981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 报修类型统计 */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">报修类型统计</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={repairTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" name="数量" radius={[8, 8, 0, 0]}>
                {repairTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 缴费情况饼图 */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">缴费情况</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {paymentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="text-gray-600">{item.value}户</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 最近报修 */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">最近报修</h3>
            <button className="text-blue-600 text-sm hover:underline">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {recentRepairs.map((repair) => (
              <div
                key={repair.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">{repair.type}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        repair.status === "已完成"
                          ? "bg-green-100 text-green-700"
                          : repair.status === "处理中"
                          ? "bg-blue-100 text-blue-700"
                          : repair.status === "已派单"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {repair.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {repair.building} {repair.unit}
                  </p>
                </div>
                <span className="text-sm text-gray-400">{repair.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 最新公告 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">最新公告</h3>
            <button className="text-blue-600 text-sm hover:underline">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900">{announcement.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {announcement.type}
                    </span>
                    <span className="text-sm text-gray-400">
                      {announcement.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
