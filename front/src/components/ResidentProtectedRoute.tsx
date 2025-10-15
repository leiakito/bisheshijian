import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserInfo } from "../utils/tokenManager";

interface ResidentProtectedRouteProps {
  children: ReactNode;
}

export function ResidentProtectedRoute({
  children,
}: ResidentProtectedRouteProps) {
  const location = useLocation();

  // 检查是否有有效的JWT token
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/resident/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 检查用户是否有USER角色
  const userInfo = getUserInfo();
  const hasResidentAccess = userInfo?.roles.some(
    (role) => role === "ROLE_USER"
  );

  if (!hasResidentAccess) {
    return (
      <Navigate
        to="/resident/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
