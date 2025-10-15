import { Fragment } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  DollarSign,
  Wrench,
  MessageSquare,
  Bell,
  User,
  Car,
  ChevronRight,
  Phone,
  CheckCircle,
  Clock,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SubmitRepairDialog } from "./SubmitRepairDialog";
import { SubmitComplaintDialog } from "./SubmitComplaintDialog";
import { clearResidentSession } from "../utils/sessionManager";

const residentInfo = {
  name: "张三",
  phone: "138****1234",
  building: "1号楼",
  unit: "2单元",
  room: "301",
  area: "120㎡",
};

const unpaidBills = [
  {
    id: "1",
    type: "物业费",
    period: "2025年1月",
    amount: 2400,
    dueDate: "2025-01-15",
    status: "待缴费",
  },
  {
    id: "2",
    type: "停车费",
    period: "2025年1月",
    amount: 300,
    dueDate: "2025-01-15",
    status: "待缴费",
  },
];

const paymentHistory = [
  {
    id: "1",
    type: "物业费",
    period: "2024年12月",
    amount: 2400,
    payDate: "2024-12-05",
    method: "微信支付",
    status: "已缴费",
  },
  {
    id: "2",
    type: "物业费+停车费",
    period: "2024年11月",
    amount: 2700,
    payDate: "2024-11-03",
    method: "支付宝",
    status: "已缴费",
  },
];

const myRepairs = [
  {
    id: "R20250105001",
    type: "水管漏水",
    description: "厨房水管接口处漏水",
    status: "处理中",
    submitTime: "2025-01-05 08:30",
    handler: "王师傅",
    rating: null,
  },
  {
    id: "R20250103001",
    type: "灯具维修",
    description: "客厅吸顶灯不亮",
    status: "已完成",
    submitTime: "2025-01-03 14:10",
    handler: "王师傅",
    rating: 5,
  },
];

const announcements = [
  {
    id: "1",
    title: "本月物业费缴纳通知",
    date: "2025-01-10",
    type: "缴费通知",
    content: "尊敬的业主：2025年1月物业费已生成账单，请及时缴纳...",
  },
  {
    id: "2",
    title: "春节期间服务安排",
    date: "2025-01-08",
    type: "重要通知",
    content: "春节假期期间，物业服务热线保持24小时开通...",
  },
];

type ResidentSection =
  | "home"
  | "payment"
  | "repair"
  | "complaint"
  | "announcement"
  | "profile";

const SECTION_TITLES: Record<ResidentSection, string> = {
  home: "智慧社区",
  payment: "缴费中心",
  repair: "报修服务",
  complaint: "投诉建议",
  announcement: "小区公告",
  profile: "个人中心",
};

const NAV_ITEMS: Array<{
  key: ResidentSection;
  label: string;
  path: string;
  icon: LucideIcon;
}> = [
  { key: "home", label: "首页", path: "/resident/home", icon: Home },
  { key: "payment", label: "缴费", path: "/resident/payment", icon: DollarSign },
  { key: "repair", label: "报修", path: "/resident/repair", icon: Wrench },
  {
    key: "announcement",
    label: "公告",
    path: "/resident/announcement",
    icon: Bell,
  },
  { key: "profile", label: "我的", path: "/resident/profile", icon: User },
];

function getActiveSection(pathname: string): ResidentSection {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "resident") {
    return "home";
  }
  const section = segments[1] as ResidentSection | undefined;
  if (!section) return "home";
  if (SECTION_TITLES[section]) {
    return section;
  }
  return "home";
}

export function ResidentPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = getActiveSection(location.pathname);
  const title = SECTION_TITLES[activeSection] ?? "智慧社区";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-gray-900">{title}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-5 gap-1">
            {NAV_ITEMS.map(({ key, label, path, icon: Icon }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-1 py-3 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="h-20" />
    </div>
  );
}

export function ResidentHomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white">
            <AvatarFallback className="bg-white text-blue-600 text-xl">
              {residentInfo.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-white mb-1">{residentInfo.name}</h2>
            <p className="text-blue-100">
              {residentInfo.building} {residentInfo.unit} {residentInfo.room}
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/resident/profile")}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/resident/payment")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow relative"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm text-gray-900">缴费</span>
          {unpaidBills.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unpaidBills.length}
            </Badge>
          )}
        </button>

        <button
          onClick={() => navigate("/resident/repair")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Wrench className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-sm text-gray-900">报修</span>
        </button>

        <button
          onClick={() => navigate("/resident/complaint")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm text-gray-900">投诉</span>
        </button>

        <button
          onClick={() => navigate("/resident/announcement")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm text-gray-900">公告</span>
        </button>
      </div>

      {unpaidBills.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">待缴费账单</h3>
            <Button
              variant="link"
              className="text-blue-600"
              onClick={() => navigate("/resident/payment")}
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {unpaidBills.slice(0, 2).map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <h4 className="text-gray-900">{bill.type}</h4>
                  <p className="text-sm text-gray-500">{bill.period}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-orange-600">¥{bill.amount}</h4>
                  <p className="text-xs text-gray-500">截止：{bill.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">我的报修</h3>
          <Button
            variant="link"
            className="text-blue-600"
            onClick={() => navigate("/resident/repair")}
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {myRepairs.length > 0 ? (
          <div className="space-y-3">
            {myRepairs.slice(0, 2).map((repair) => (
              <div
                key={repair.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-gray-900">{repair.type}</h4>
                  <p className="text-sm text-gray-500">{repair.description}</p>
                </div>
                <Badge
                  variant={repair.status === "已完成" ? "default" : "secondary"}
                >
                  {repair.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">暂无报修记录</div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">最新公告</h3>
          <Button
            variant="link"
            className="text-blue-600"
            onClick={() => navigate("/resident/announcement")}
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {announcements.slice(0, 2).map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate("/resident/announcement")}
            >
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-gray-900 flex-1">{announcement.title}</h4>
                <Badge variant="outline">{announcement.type}</Badge>
              </div>
              <p className="text-sm text-gray-500">{announcement.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ResidentPaymentPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="unpaid">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unpaid">待缴费 ({unpaidBills.length})</TabsTrigger>
          <TabsTrigger value="history">缴费记录</TabsTrigger>
        </TabsList>

        <TabsContent value="unpaid" className="space-y-4 mt-6">
          {unpaidBills.map((bill) => (
            <Card key={bill.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{bill.type}</h3>
                  <p className="text-sm text-gray-500">账期：{bill.period}</p>
                  <p className="text-sm text-gray-500">截止日期：{bill.dueDate}</p>
                </div>
                <Badge variant="secondary">{bill.status}</Badge>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">应缴金额</p>
                  <h2 className="text-orange-600">¥{bill.amount}</h2>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">立即缴费</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {paymentHistory.map((payment) => (
            <Card key={payment.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{payment.type}</h3>
                  <p className="text-sm text-gray-500">账期：{payment.period}</p>
                  <p className="text-sm text-gray-500">缴费时间：{payment.payDate}</p>
                </div>
                <Badge variant="default">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {payment.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">缴费金额</p>
                  <h3 className="text-green-600">¥{payment.amount}</h3>
                </div>
                <Badge variant="outline">{payment.method}</Badge>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ResidentRepairPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDialogOpen = location.pathname === "/resident/repair/new";

  const handleDialogChange = (open: boolean) => {
    if (open) {
      navigate("/resident/repair/new", { replace: true });
    } else {
      navigate("/resident/repair", { replace: true });
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/resident/repair/new")}
        >
          <Wrench className="w-4 h-4 mr-2" />
          提交报修申请
        </Button>

        <div className="space-y-4">
          <h3 className="text-gray-900">我的报修</h3>
          {myRepairs.map((repair) => (
            <Card key={repair.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{repair.type}</h3>
                    <Badge
                      variant={
                        repair.status === "已完成"
                          ? "default"
                          : repair.status === "处理中"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {repair.status === "处理中" && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {repair.status === "已完成" && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {repair.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{repair.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>工单号：{repair.id}</span>
                    <span>提交时间：{repair.submitTime}</span>
                  </div>
                </div>
              </div>
              {repair.handler && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
                  <User className="w-4 h-4" />
                  <span>维修人员：{repair.handler}</span>
                </div>
              )}
              {repair.status === "已完成" && !repair.rating && (
                <Button variant="outline" className="w-full mt-4">
                  评价服务
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <SubmitRepairDialog open={isDialogOpen} onOpenChange={handleDialogChange} />
    </Fragment>
  );
}

export function ResidentComplaintPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDialogOpen = location.pathname === "/resident/complaint/new";

  const handleDialogChange = (open: boolean) => {
    if (open) {
      navigate("/resident/complaint/new", { replace: true });
    } else {
      navigate("/resident/complaint", { replace: true });
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/resident/complaint/new")}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          提交投诉建议
        </Button>

        <Card className="p-6">
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>暂无投诉记录</p>
          </div>
        </Card>
      </div>

      <SubmitComplaintDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
      />
    </Fragment>
  );
}

export function ResidentAnnouncementPage() {
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-gray-900">{announcement.title}</h3>
                <Badge variant="outline">{announcement.type}</Badge>
              </div>
              <p className="text-gray-600 mb-3">{announcement.content}</p>
              <p className="text-sm text-gray-500">{announcement.date}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ResidentProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearResidentSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {residentInfo.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-gray-900">{residentInfo.name}</h2>
            <p className="text-gray-500">{residentInfo.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Home className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">房屋地址</p>
              <p className="text-gray-900">
                {residentInfo.building} {residentInfo.unit} {residentInfo.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Home className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">房屋面积</p>
              <p className="text-gray-900">{residentInfo.area}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">联系电话</p>
              <p className="text-gray-900">{residentInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">车辆信息</p>
              <p className="text-gray-900">京A12345 - 丰田凯美瑞</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">账号设置</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-900">修改密码</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-900">绑定手机</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </Card>

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        退出登录
      </Button>
    </div>
  );
}
