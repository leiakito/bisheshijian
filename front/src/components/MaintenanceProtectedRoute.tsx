import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isMaintenanceAuthenticated } from "../utils/sessionManager";

interface MaintenanceProtectedRouteProps {
  children: ReactNode;
}

export function MaintenanceProtectedRoute({
  children,
}: MaintenanceProtectedRouteProps) {
  const location = useLocation();

  if (!isMaintenanceAuthenticated()) {
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
