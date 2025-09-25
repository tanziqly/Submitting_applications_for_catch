import type { FC } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  // useLocation,
} from "react-router-dom";

import { ROUTE_CONSTANTS } from "@shared/config/routes";
import { Application } from "@pages/Application";
import { Home } from "@pages/Home";
import { SignIn } from "@pages/SignIn";
import { SignUp } from "@pages/SignUp";
import { NotFound } from "@pages/NotFound";
import { ServerError } from "@pages/ServerError";
import { Layout } from "@widgets/Layout";
import { DashboardPage } from "./Dashboard/ui";

// const ProtectedRoute: FC<{ children: ReactNode }> = observer(({ children }) => {
//   const location = useLocation();

//   if (!authStore.isAuthChecked) {
//     return <Loader />;
//   }

//   if (!authStore.isAuthenticated) {
//     // Сохраняем информацию о том, куда перенаправлять после авторизации
//     return (
//       <Navigate
//         to={ROUTE_CONSTANTS.SIGNIN}
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   return <>{children}</>;
// });

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Публичные маршруты */}
          <Route path={ROUTE_CONSTANTS.SIGNIN} element={<SignIn />} />
          <Route path={ROUTE_CONSTANTS.SIGNUP} element={<SignUp />} />
          {/* Защищенные маршруты */}
          <Route path={ROUTE_CONSTANTS.HOME} element={<Home />} />
          <Route path={ROUTE_CONSTANTS.APPLICATION} element={<Application />} />
          {/* Открытые маршруты */}
          <Route path={ROUTE_CONSTANTS.NOTFOUND} element={<NotFound />} />
          <Route path={ROUTE_CONSTANTS.SERVERERROR} element={<ServerError />} />
          <Route path={ROUTE_CONSTANTS.DASHBOARD} element={<DashboardPage />} />
          // {/* Редирект для несуществующих путей */}
          <Route
            path="*"
            element={<Navigate to={ROUTE_CONSTANTS.NOTFOUND} replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
