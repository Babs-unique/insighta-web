import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useGetCurrentUserQuery } from "@/feature/authSlice";

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole: string;
}

const RoleProtectedRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user || error) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but doesn't have required role
  if (user.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  // Has required role - render children
  return <>{children}</>;
};

export default RoleProtectedRoute;
