import { Fragment, useState, useEffect } from "react";
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
import { clearAuth } from "../utils/tokenManager";
import { getCurrentUser } from "../services/authService";
import { getAllBills, createPayment } from "../services/feeService";
import { getAllRepairOrders } from "../services/repairService";
import { getAllComplaints } from "../services/complaintService";
import { getLatestAnnouncements } from "../services/announcementService";
import type { Bill, RepairOrder, Complaint, Announcement } from "../types/api";

interface ResidentInfo {
  name: string;
  phone: string;
  building: string;
  unit: string;
  roomNumber: string;
  area: string;
}

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
  const [residentInfo, setResidentInfo] = useState<ResidentInfo | null>(null);
  const [unpaidBills, setUnpaidBills] = useState<Bill[]>([]);
  const [myRepairs, setMyRepairs] = useState<RepairOrder[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userInfo = await getCurrentUser();

        if (userInfo.resident) {
          setResidentInfo({
            name: userInfo.resident.name,
            phone: userInfo.resident.phone,
            building: userInfo.resident.building,
            unit: userInfo.resident.unit,
            roomNumber: userInfo.resident.roomNumber,
            area: userInfo.resident.area,
          });

          // 加载该业主的数据
          const [bills, repairs, announcements] = await Promise.all([
            getAllBills(userInfo.resident.name),
            getAllRepairOrders(userInfo.resident.name),
            getLatestAnnouncements(),
          ]);

          setUnpaidBills(bills.filter(b => b.status === "PENDING" || b.status === "OVERDUE"));
          setMyRepairs(repairs);
          setAnnouncements(announcements);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading || !residentInfo) {
    return <div className="text-center py-12">加载中...</div>;
  }

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
              {residentInfo.building} {residentInfo.unit} {residentInfo.roomNumber}
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
            <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
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
                  <p className="text-sm text-gray-500">{bill.billingPeriod}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-orange-600">¥{bill.amount}</h4>
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
                  variant={repair.status === "COMPLETED" ? "default" : "secondary"}
                >
                  {repair.status === "PENDING" && "待处理"}
                  {repair.status === "IN_PROGRESS" && "处理中"}
                  {repair.status === "COMPLETED" && "已完成"}
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
                <Badge variant="outline">{announcement.targetScope}</Badge>
              </div>
              <p className="text-sm text-gray-500">
                {announcement.publishAt ? new Date(announcement.publishAt).toLocaleDateString() : ''}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ResidentPaymentPage() {
  const [unpaidBills, setUnpaidBills] = useState<Bill[]>([]);
  const [paidBills, setPaidBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBills() {
      try {
        const userInfo = await getCurrentUser();
        if (userInfo.resident) {
          const bills = await getAllBills(userInfo.resident.name);
          setUnpaidBills(bills.filter(b => b.status === "PENDING" || b.status === "OVERDUE"));
          setPaidBills(bills.filter(b => b.status === "PAID"));
        }
      } catch (error) {
        console.error("Failed to load bills:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBills();
  }, []);

  const handlePayment = async (billId: number) => {
    try {
      await createPayment({ billId, payMethod: "微信支付" });
      // 重新加载账单
      const userInfo = await getCurrentUser();
      if (userInfo.resident) {
        const bills = await getAllBills(userInfo.resident.name);
        setUnpaidBills(bills.filter(b => b.status === "PENDING" || b.status === "OVERDUE"));
        setPaidBills(bills.filter(b => b.status === "PAID"));
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("缴费失败，请稍后重试");
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="unpaid">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unpaid">待缴费 ({unpaidBills.length})</TabsTrigger>
          <TabsTrigger value="history">缴费记录 ({paidBills.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unpaid" className="space-y-4 mt-6">
          {unpaidBills.map((bill) => (
            <Card key={bill.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{bill.type}</h3>
                  <p className="text-sm text-gray-500">账期：{bill.billingPeriod}</p>
                </div>
                <Badge variant={bill.status === "OVERDUE" ? "destructive" : "secondary"}>
                  {bill.status === "OVERDUE" ? "已逾期" : "待缴费"}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">应缴金额</p>
                  <h2 className="text-orange-600">¥{bill.amount}</h2>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePayment(bill.id)}
                >
                  立即缴费
                </Button>
              </div>
            </Card>
          ))}
          {unpaidBills.length === 0 && (
            <div className="text-center py-12 text-gray-500">暂无待缴费账单</div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {paidBills.map((bill) => (
            <Card key={bill.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{bill.type}</h3>
                  <p className="text-sm text-gray-500">账期：{bill.billingPeriod}</p>
                  <p className="text-sm text-gray-500">
                    缴费时间：{bill.paidAt ? new Date(bill.paidAt).toLocaleDateString() : ''}
                  </p>
                </div>
                <Badge variant="default">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已缴费
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">缴费金额</p>
                  <h3 className="text-green-600">¥{bill.amount}</h3>
                </div>
                {bill.payMethod && <Badge variant="outline">{bill.payMethod}</Badge>}
              </div>
            </Card>
          ))}
          {paidBills.length === 0 && (
            <div className="text-center py-12 text-gray-500">暂无缴费记录</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ResidentRepairPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDialogOpen = location.pathname === "/resident/repair/new";
  const [myRepairs, setMyRepairs] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRepairs = async () => {
    try {
      const userInfo = await getCurrentUser();
      if (userInfo.resident) {
        const repairs = await getAllRepairOrders(userInfo.resident.name);
        setMyRepairs(repairs);
      }
    } catch (error) {
      console.error("Failed to load repairs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  const handleDialogChange = (open: boolean) => {
    if (open) {
      navigate("/resident/repair/new", { replace: true });
    } else {
      navigate("/resident/repair", { replace: true });
      // 重新加载数据
      loadRepairs();
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

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
                        repair.status === "COMPLETED"
                          ? "default"
                          : repair.status === "IN_PROGRESS"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {repair.status === "IN_PROGRESS" && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {repair.status === "COMPLETED" && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {repair.status === "PENDING" && "待处理"}
                      {repair.status === "IN_PROGRESS" && "处理中"}
                      {repair.status === "COMPLETED" && "已完成"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{repair.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>工单号：{repair.orderNumber}</span>
                    <span>提交时间：{repair.createdAt ? new Date(repair.createdAt).toLocaleString() : ''}</span>
                  </div>
                </div>
              </div>
              {repair.assignedWorker && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
                  <User className="w-4 h-4" />
                  <span>维修人员：{repair.assignedWorker}</span>
                </div>
              )}
            </Card>
          ))}
          {myRepairs.length === 0 && (
            <div className="text-center py-12 text-gray-500">暂无报修记录</div>
          )}
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
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const userInfo = await getCurrentUser();
      if (userInfo.resident) {
        const complaints = await getAllComplaints(userInfo.resident.name);
        setMyComplaints(complaints);
      }
    } catch (error) {
      console.error("Failed to load complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleDialogChange = (open: boolean) => {
    if (open) {
      navigate("/resident/complaint/new", { replace: true });
    } else {
      navigate("/resident/complaint", { replace: true });
      // 重新加载数据
      loadComplaints();
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

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

        <div className="space-y-4">
          <h3 className="text-gray-900">我的投诉</h3>
          {myComplaints.map((complaint) => (
            <Card key={complaint.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{complaint.type}</h3>
                    <Badge
                      variant={
                        complaint.status === "COMPLETED"
                          ? "default"
                          : complaint.status === "PROCESSING"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {complaint.status === "PENDING" && "待处理"}
                      {complaint.status === "PROCESSING" && "处理中"}
                      {complaint.status === "COMPLETED" && "已完成"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{complaint.description}</p>
                  {complaint.reply && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">回复：</span>
                        {complaint.reply}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {complaint.processedBy && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
                  <User className="w-4 h-4" />
                  <span>处理人：{complaint.processedBy}</span>
                </div>
              )}
            </Card>
          ))}
          {myComplaints.length === 0 && (
            <div className="text-center py-12 text-gray-500">暂无投诉记录</div>
          )}
        </div>
      </div>

      <SubmitComplaintDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
      />
    </Fragment>
  );
}

export function ResidentAnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await getLatestAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, []);

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

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
                <Badge variant="outline">{announcement.targetScope}</Badge>
              </div>
              <p className="text-gray-600 mb-3">{announcement.content}</p>
              <p className="text-sm text-gray-500">
                {announcement.publishAt ? new Date(announcement.publishAt).toLocaleString() : ''}
              </p>
            </div>
          </div>
        </Card>
      ))}
      {announcements.length === 0 && (
        <div className="text-center py-12 text-gray-500">暂无公告</div>
      )}
    </div>
  );
}

export function ResidentProfilePage() {
  const navigate = useNavigate();
  const [residentInfo, setResidentInfo] = useState<ResidentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const userInfo = await getCurrentUser();
        if (userInfo.resident) {
          setResidentInfo({
            name: userInfo.resident.name,
            phone: userInfo.resident.phone,
            building: userInfo.resident.building,
            unit: userInfo.resident.unit,
            roomNumber: userInfo.resident.roomNumber,
            area: userInfo.resident.area,
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  if (loading || !residentInfo) {
    return <div className="text-center py-12">加载中...</div>;
  }

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
                {residentInfo.building} {residentInfo.unit} {residentInfo.roomNumber}
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
        </div>
      </Card>

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        退出登录
      </Button>
    </div>
  );
}
