import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserInfo } from "../utils/tokenManager";

interface MaintenanceProtectedRouteProps {
  children: ReactNode;
}

export function MaintenanceProtectedRoute({
  children,
}: MaintenanceProtectedRouteProps) {
  const location = useLocation();

  // 检查是否已登录
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/maintenance/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 检查是否有维护人员权限（ENGINEER或ADMIN角色）
  const userInfo = getUserInfo();
  const hasPermission = userInfo?.roles.some(
    (role) => role === "ROLE_ENGINEER" || role === "ROLE_ADMIN"
  );

  if (!hasPermission) {
    // 如果没有权限，重定向到登录页面
    return (
      <Navigate
        to="/maintenance/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
