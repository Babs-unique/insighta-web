import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useGetCurrentUserQuery } from "@/feature/authSlice";

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole: string;
}

const RoleProtectedRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const currentUser = user?.data ?? user;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Not authenticated
  if (!currentUser || error) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but doesn't have required role
  if (currentUser.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  // Has required role - render children
  return <>{children}</>;
};

export default RoleProtectedRoute;
