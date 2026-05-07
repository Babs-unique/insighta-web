/* import { ReactNode } from 'react';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  // Get current user from context or localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user.id) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
 */