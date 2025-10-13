import { useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ResidentProtectedRoute } from "./components/ResidentProtectedRoute";
import { MaintenanceProtectedRoute } from "./components/MaintenanceProtectedRoute";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { ResidentLogin } from "./components/ResidentLogin";
import { MaintenanceLogin } from "./components/MaintenanceLogin";
import {
  ResidentPortalLayout,
  ResidentHomePage,
  ResidentPaymentPage,
  ResidentRepairPage,
  ResidentComplaintPage,
  ResidentAnnouncementPage,
  ResidentProfilePage,
} from "./components/ResidentPortal";
import {
  MaintenancePortalLayout,
  MaintenanceOrdersPage,
} from "./components/MaintenancePortal";
import { Dashboard } from "./components/Dashboard";
import { ResidentManagement } from "./components/ResidentManagement";
import { FeeManagement } from "./components/FeeManagement";
import { ServiceManagement } from "./components/ServiceManagement";
import { CommunityManagement } from "./components/CommunityManagement";
import { SystemManagement } from "./components/SystemManagement";
import { NotificationCenter } from "./components/NotificationCenter";
import { ProfilePage } from "./components/ProfilePage";
import { FinancialReport } from "./components/FinancialReport";
import { Sidebar } from "./components/Sidebar";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { LogOut, Bell, User } from "lucide-react";
import {
  clearAuth,
  getUserInfo,
  TokenManager,
  getTokenRemainingTime,
  formatRemainingTime,
  getToken,
} from "./utils/tokenManager";
import { adminRoutes, getPageTitle } from "./routes/routeConfig";

const AnimationStyles = () => (
  <style>{`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fade-out-up {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
    .animate-fade-out-up {
      animation: fade-out-up 0.5s ease-out forwards;
    }
  `}</style>
);

function renderWithPermission(element: JSX.Element, roles?: string[]) {
  if (!roles || roles.length === 0) {
    return element;
  }

  const info = getUserInfo();
  const userRoles = info?.roles ?? [];

  // 标准化角色名称：去掉 ROLE_ 前缀进行比较
  const normalizeRole = (role: string) => role.replace(/^ROLE_/, '');
  const normalizedUserRoles = userRoles.map(normalizeRole);
  const normalizedRequiredRoles = roles.map(normalizeRole);

  const hasPermission = normalizedRequiredRoles.some((role) =>
    normalizedUserRoles.includes(role)
  );

  console.log("权限检查:", {
    需要的角色: roles,
    用户角色: userRoles,
    标准化后需要的角色: normalizedRequiredRoles,
    标准化后用户角色: normalizedUserRoles,
    是否有权限: hasPermission
  });

  return hasPermission ? element : <Navigate to="/admin/dashboard" replace />;
}

function getRolesById(id: string) {
  return adminRoutes.find((route) => route.id === id)?.roles;
}

function AdminProfileRoute() {
  const info = getUserInfo();
  const profileInfo = info
    ? {
        name: info.displayName,
        role: info.roles.some((r) => r === "ADMIN" || r === "ROLE_ADMIN")
          ? "管理员"
          : "用户",
      }
    : { name: "管理员", role: "管理员" };

  return <ProfilePage userInfo={profileInfo} />;
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = 3;
  const userInfo = (() => {
    const stored = getUserInfo();
    if (!stored) {
      return { name: "管理员", role: "管理员" };
    }
    return {
      name: stored.displayName,
      role: stored.roles.some((r) => r === "ADMIN" || r === "ROLE_ADMIN")
        ? "管理员"
        : "用户",
    };
  })();

  const tokenManagerRef = useRef<TokenManager | null>(null);

  useEffect(() => {
    const manager = new TokenManager({
      onTokenExpired: () => {
        toast.error("登录已过期，请重新登录");
        clearAuth();
        navigate("/admin/login", { replace: true });
      },
      onTokenExpiringSoon: () => {
        const token = getToken();
        if (token) {
          const remaining = getTokenRemainingTime(token);
          toast.warning(
            `您的登录即将过期，剩余时间：${formatRemainingTime(remaining)}`
          );
        }
      },
    });

    tokenManagerRef.current = manager;
    manager.startMonitoring();

    return () => {
      manager.stopMonitoring();
    };
  }, [navigate]);

  const menuItems = adminRoutes.map(({ id, label, icon, path }) => ({
    id,
    label,
    icon,
    path,
  }));

  const handleLogout = () => {
    tokenManagerRef.current?.stopMonitoring();
    clearAuth();
    navigate("/admin/login", { replace: true });
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 animate-fade-in">
      <Sidebar menuItems={menuItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800">{pageTitle}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/notifications")}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="通知中心"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {userInfo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-gray-900 text-sm">{userInfo.name}</div>
                    <div className="text-xs text-gray-500">{userInfo.role}</div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    个人中心
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/notifications")}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    通知中心
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AnimationStyles />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/resident/login" element={<ResidentLogin />} />
        <Route path="/maintenance/login" element={<MaintenanceLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute redirectTo="/admin/login">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={renderWithPermission(
              <Dashboard />,
              getRolesById("dashboard")
            )}
          />
          <Route
            path="residents"
            element={renderWithPermission(
              <ResidentManagement />,
              getRolesById("residents")
            )}
          />
          <Route
            path="fees"
            element={renderWithPermission(
              <FeeManagement />,
              getRolesById("fees")
            )}
          />
          <Route
            path="service"
            element={renderWithPermission(
              <ServiceManagement />,
              getRolesById("service")
            )}
          />
          <Route
            path="community"
            element={renderWithPermission(
              <CommunityManagement />,
              getRolesById("community")
            )}
          />
          <Route
            path="system"
            element={renderWithPermission(
              <SystemManagement />,
              getRolesById("system")
            )}
          />
          <Route
            path="notifications"
            element={renderWithPermission(<NotificationCenter />, [
              "ADMIN",
              "USER",
            ])}
          />
          <Route
            path="profile"
            element={renderWithPermission(<AdminProfileRoute />, ["ADMIN"])}
          />
          <Route
            path="financial-report"
            element={renderWithPermission(<FinancialReport />, ["ADMIN"])}
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/resident"
          element={
            <ResidentProtectedRoute>
              <ResidentPortalLayout />
            </ResidentProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ResidentHomePage />} />
          <Route path="payment" element={<ResidentPaymentPage />} />
          <Route path="repair">
            <Route index element={<ResidentRepairPage />} />
            <Route path="new" element={<ResidentRepairPage />} />
          </Route>
          <Route path="complaint">
            <Route index element={<ResidentComplaintPage />} />
            <Route path="new" element={<ResidentComplaintPage />} />
          </Route>
          <Route
            path="announcement"
            element={<ResidentAnnouncementPage />}
          />
          <Route path="profile" element={<ResidentProfilePage />} />
        </Route>

        <Route
          path="/maintenance"
          element={
            <MaintenanceProtectedRoute>
              <MaintenancePortalLayout />
            </MaintenanceProtectedRoute>
          }
        >
          <Route index element={<Navigate to="orders/pending" replace />} />
          <Route path="orders">
            <Route path=":status" element={<MaintenanceOrdersPage />} />
            <Route path=":status/:orderId" element={<MaintenanceOrdersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
