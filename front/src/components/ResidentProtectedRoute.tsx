import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isResidentAuthenticated } from "../utils/sessionManager";

interface ResidentProtectedRouteProps {
  children: ReactNode;
}

export function ResidentProtectedRoute({
  children,
}: ResidentProtectedRouteProps) {
  const location = useLocation();

  if (!isResidentAuthenticated()) {
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
