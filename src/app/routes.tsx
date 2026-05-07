import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilesListPage } from "./pages/ProfilesListPage";
import { ProfileDetailPage } from "./pages/ProfileDetailPage";
import { SearchPage } from "./pages/SearchPage";
import { ExportPage } from "./pages/ExportPage";
import { ManageProfilesPage } from "./pages/ManageProfilesPage";
import { AccountPage } from "./pages/AccountPage";
/* import { ProtectedRoute } from "./components/ProtectedRoute"; */

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "profiles", Component: ProfilesListPage },
      { path: "profiles/:id", Component: ProfileDetailPage },
      { path: "search", Component: SearchPage },
      { path: "export", Component: ExportPage },
      {
        path: "manage",
        element: (
         /*  <ProtectedRoute requiredRole="admin"> */
            <ManageProfilesPage />
 /*          </ProtectedRoute> */
        )
      },
      { path: "account", Component: AccountPage },
    ],
  },
]);
