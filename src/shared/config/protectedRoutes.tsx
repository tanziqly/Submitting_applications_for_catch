import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "@features/auth";
import { ROUTE_CONSTANTS } from "@shared/config/routes";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = observer(
  ({ children }) => {
    if (!authStore.isAuthenticated) {
      return <Navigate to={ROUTE_CONSTANTS.HOME} replace />;
    }

    return <>{children}</>;
  }
);
