import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

// 随机数生成工具函数
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// 生成随机仪表盘数据
const generateRandomSummary = (): DashboardSummary => ({
  totalResidents: randomInt(800, 1500),
  pendingRepairs: randomInt(5, 30),
  pendingComplaints: randomInt(2, 15),
  monthlyIncome: randomInt(250000, 400000),
  occupancyRate: randomInt(75, 98),
  paymentRate: randomInt(80, 95),
});

export function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRandomData, setUseRandomData] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
      setError(null);
      setUseRandomData(false);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      console.log("使用随机数据生成仪表盘...");
      // 后端API失败时使用随机数据
      setSummary(generateRandomSummary());
      setError(null); // 不显示错误，直接使用随机数据
      setUseRandomData(true);
    } finally {
      setLoading(false);
    }
  };

  // ========== 所有 hooks 必须在条件返回之前调用 ==========

  // 使用后端数据构建统计卡片
  const stats = useMemo(() => [
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
  ], [summary]);

  // 生成随机数据（使用 useMemo 避免每次渲染都重新生成）
  const quickStats = useMemo(() => {
    const parkingUsed = randomInt(400, 500);
    const parkingTotal = 520;
    return [
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
      { label: "车位使用", value: `${parkingUsed}/${parkingTotal}`, icon: Car },
    ];
  }, [summary]);

  const recentRepairs = useMemo(() => {
    const repairTypes = ["水管漏水", "电梯故障", "门禁损坏", "灯具维修", "空调维修", "窗户维修", "墙体开裂", "下水道堵塞"];
    const statuses = ["处理中", "已派单", "待处理", "已完成"];
    const times = ["2小时前", "5小时前", "1天前", "2天前", "3天前"];

    return Array.from({ length: 4 }, (_, i) => ({
      id: String(i + 1),
      building: `${randomInt(1, 6)}号楼`,
      unit: `${randomInt(1, 3)}单元${randomInt(1, 6)}0${randomInt(1, 8)}`,
      type: repairTypes[randomInt(0, repairTypes.length - 1)],
      status: statuses[randomInt(0, statuses.length - 1)],
      time: times[randomInt(0, times.length - 1)],
    }));
  }, [useRandomData]);

  const announcements = useMemo(() => {
    const titles = [
      "本月物业费缴纳通知",
      "春节期间服务安排",
      "消防设施定期检查",
      "电梯维护通知",
      "小区绿化养护计划",
      "停车场管理规定",
    ];
    const types = ["缴费通知", "重要通知", "日常公告"];
    const today = new Date();

    return Array.from({ length: 3 }, (_, i) => {
      const daysAgo = i * 2 + randomInt(0, 2);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      return {
        id: String(i + 1),
        title: titles[randomInt(0, titles.length - 1)],
        date: date.toISOString().split('T')[0],
        type: types[randomInt(0, types.length - 1)],
      };
    });
  }, [useRandomData]);

  // 收入趋势数据
  const revenueData = useMemo(() => {
    const months = ["7月", "8月", "9月", "10月", "11月", "12月", "1月"];
    const baseRevenue = summary?.monthlyIncome || 300000;

    return months.map((month, i) => {
      const variance = randomInt(-15000, 15000);
      const revenue = Math.round(baseRevenue + variance);
      const target = Math.round(baseRevenue + randomInt(-5000, 10000));
      return { month, revenue, target };
    });
  }, [summary, useRandomData]);

  // 报修类型统计
  const repairTypeData = useMemo(() => [
    { type: "水电维修", count: randomInt(30, 60), color: "#3b82f6" },
    { type: "电梯维护", count: randomInt(20, 40), color: "#10b981" },
    { type: "门禁维修", count: randomInt(10, 30), color: "#f59e0b" },
    { type: "公共设施", count: randomInt(5, 20), color: "#ef4444" },
    { type: "其他", count: randomInt(3, 15), color: "#8b5cf6" },
  ], [useRandomData]);

  // 缴费情况统计
  const paymentData = useMemo(() => {
    const totalHouseholds = summary?.totalResidents || 1000;
    const paidRate = (summary?.paymentRate || 75) / 100;
    const paid = Math.round(totalHouseholds * paidRate);
    const pending = Math.round(totalHouseholds * randomInt(15, 25) / 100);
    const overdue = totalHouseholds - paid - pending;

    return [
      { name: "已缴费", value: paid, color: "#10b981" },
      { name: "待缴费", value: pending, color: "#f59e0b" },
      { name: "已逾期", value: Math.max(0, overdue), color: "#ef4444" },
    ];
  }, [summary, useRandomData]);

  // ========== 条件返回必须在所有 hooks 之后 ==========

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

  // 如果出错，显示错误信息（实际上我们已经用随机数据替代了）
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

  return (
    <div className="space-y-6">
      {/* 数据来源提示和刷新按钮 */}
      {useRandomData && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-900 text-sm font-medium">正在使用模拟数据</p>
                <p className="text-blue-700 text-xs">后端API暂时不可用，显示的是随机生成的演示数据</p>
              </div>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        </Card>
      )}

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
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => navigate("/admin/service")}
            >
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
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => navigate("/admin/notifications")}
            >
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
