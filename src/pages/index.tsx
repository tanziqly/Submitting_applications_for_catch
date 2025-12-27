// src/app/Router.tsx

import type { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ROUTE_CONSTANTS } from "@shared/config/routes";
import { Application } from "@pages/Application";
import { Home } from "@pages/Home";
import { SignIn } from "@pages/SignIn";
import { NotFound } from "@pages/NotFound";
import { ServerError } from "@pages/ServerError";
import { Layout } from "@widgets/Layout";
import { DashboardPage } from "./Dashboard/ui";
import { OrderLog } from "./OrderLog";
import { Profile } from "./Profile";

import { ProtectedRoute } from "@shared/config/protectedRoutes";
import { Admin } from "./Admin";
import { authStore } from "@features/auth";

export const Router: FC = () => {
  const { user } = authStore;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Публичные маршруты */}
          <Route path={ROUTE_CONSTANTS.SIGNIN} element={<SignIn />} />

          {user?.login === "ryaon_comm" && (
            <Route
              path={ROUTE_CONSTANTS.ADMIN}
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          )}

          {/* Защищенный маршрут: Profile, Application, Dashboard, OrderLog */}
          <Route
            path={ROUTE_CONSTANTS.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_CONSTANTS.APPLICATION}
            element={
              <ProtectedRoute>
                <Application />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_CONSTANTS.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_CONSTANTS.ORDER_LOG}
            element={
              <ProtectedRoute>
                <OrderLog />
              </ProtectedRoute>
            }
          />

          {/* Остальные маршруты */}
          <Route path={ROUTE_CONSTANTS.HOME} element={<Home />} />
          <Route path={ROUTE_CONSTANTS.NOTFOUND} element={<NotFound />} />
          <Route path={ROUTE_CONSTANTS.SERVERERROR} element={<ServerError />} />

          {/* Редирект для несуществующих путей */}
          <Route
            path="*"
            element={<Navigate to={ROUTE_CONSTANTS.NOTFOUND} replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
