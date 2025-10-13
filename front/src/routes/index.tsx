import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Dashboard } from "../components/Dashboard";
import { ResidentManagement } from "../components/ResidentManagement";
import { FeeManagement } from "../components/FeeManagement";
import { ServiceManagement } from "../components/ServiceManagement";
import { CommunityManagement } from "../components/CommunityManagement";
import { SystemManagement } from "../components/SystemManagement";
import { NotificationCenter } from "../components/NotificationCenter";
import { ProfilePage } from "../components/ProfilePage";
import { FinancialReport } from "../components/FinancialReport";

/**
 * 管理后台路由配置
 */
export function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="residents" element={<ResidentManagement />} />
      <Route path="fees" element={<FeeManagement />} />
      <Route path="service" element={<ServiceManagement />} />
      <Route path="community" element={<CommunityManagement />} />
      <Route path="system" element={<SystemManagement />} />
      <Route path="notifications" element={<NotificationCenter />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="financial-report" element={<FinancialReport />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
