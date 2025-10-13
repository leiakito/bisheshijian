import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/tokenManager";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * 路由守卫组件
 * 检查用户是否已登录，未登录则重定向到登录页
 */
export function ProtectedRoute({
  children,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // 保存当前路径，登录后可以返回
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
