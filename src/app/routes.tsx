import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilesListPage } from "./pages/ProfilesListPage";
import { ProfileDetailPage } from "./pages/ProfileDetailPage";
import { SearchPage } from "./pages/SearchPage";
import { ExportPage } from "./pages/ExportPage";
import { ManageProfilesPage } from "./pages/ManageProfilesPage";
import { AccountPage } from "./pages/AccountPage";
import  ProtectedRoute  from "./components/ProtectedRoute";
import RoleProtectedRoute  from "./components/RoleProtectedRoute";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/auth/callback",
      element: <AuthCallbackPage />,
    },
    {
      path: "/app",
        element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
        ),
      children: [
        { index: true, Component: DashboardPage },
        { path: "profiles", Component: ProfilesListPage },
        { path: "profiles/:id", Component: ProfileDetailPage },
        { path: "search", Component: SearchPage },
        { path: "export", Component: ExportPage },
        {
          path: "manage",
          element: (
            <RoleProtectedRoute requiredRole="admin">
              <ManageProfilesPage />
            </RoleProtectedRoute>
          ),
        },
        { path: "account", Component: AccountPage },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_URL || "/insighta-web",
  }
);
