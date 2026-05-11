// OAuth Implementation - Quick Reference
// =======================================

// ============================================================================
// ADDING A NEW LOGOUT BUTTON
// ============================================================================

/**
 * Example component with logout:
 */

import { useLogoutMutation } from '@/feature/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/feature/apiSlice';

function LogoutButton() {
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout()); // Clear Redux state
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still redirect even if backend fails
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}

// ============================================================================
// CHECKING AUTH STATUS IN ANY COMPONENT
// ============================================================================

/**
 * Option 1: Check Redux state (fastest, no API call):
 */

import { useSelector } from 'react-redux';
import { RootState } from '@/services/store';

function MyComponent() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return <div>{isAuthenticated ? `Hi ${user.name}` : 'Not logged in'}</div>;
}

/**
 * Option 2: Fetch fresh user data (always synced with backend):
 */

import { useGetCurrentUserQuery } from '@/feature/authSlice';

function MyComponent() {
  const { data: user, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <div>Loading...</div>;
  return <div>{user ? `Hi ${user.name}` : 'Not logged in'}</div>;
}

// ============================================================================
// HANDLING AUTH ERRORS IN API CALLS
// ============================================================================

/**
 * The baseQueryWithReauth handles most cases automatically:
 * 
 * 1. Any 401 error triggers refresh attempt
 * 2. If refresh fails, logout is dispatched
 * 3. You can catch errors in components
 */

import { useProfilesQuery } from '@/feature/profileSlice'; // Example query

function ProfilesList() {
  const { data: profiles, isLoading, error } = useProfilesQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    // Could be:
    // - 401 (session expired, refresh failed -> user redirected to /login)
    // - 403 (user not authorized for this resource)
    // - 500 (server error)
    console.error('Failed to load profiles:', error);
    return <div>Failed to load profiles</div>;
  }

  return (
    <div>
      {profiles.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}

// ============================================================================
// PROTECTING A NEW ROUTE
// ============================================================================

/**
 * Wrap protected routes with ProtectedRoute component:
 */

import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AdminPage } from './pages/AdminPage';

// In routes.tsx:
export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
]);

// ============================================================================
// ADDING ROLE-BASED PROTECTION
// ============================================================================

/**
 * Enhanced ProtectedRoute with role check:
 */

import { useGetCurrentUserQuery } from '@/feature/authSlice';
import { Navigate } from 'react-router-dom';

interface RoleProtectedRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

export function RoleProtectedRoute({ requiredRole, children }: RoleProtectedRouteProps) {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || error) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

// Usage in routes.tsx:
// {
//   path: 'admin',
//   element: (
//     <RoleProtectedRoute requiredRole="admin">
//       <AdminPage />
//     </RoleProtectedRoute>
//   ),
// }

// ============================================================================
// DISPLAYING CURRENT USER
// ============================================================================

/**
 * Simple user display component:
 */

import { useSelector } from 'react-redux';
import { RootState } from '@/services/store';

function UserProfile() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  return (
    <div>
      <img src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// ============================================================================
// REDIRECTING AFTER LOGIN
// ============================================================================

/**
 * Already implemented in AuthCallbackPage
 * But if you need custom redirect logic:
 */

import { useLocation, useNavigate } from 'react-router-dom';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query params if provided
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/app';

  // After auth succeeds:
  navigate(redirectTo);
}

// ============================================================================
// DEBUGGING AUTH ISSUES
// ============================================================================

/**
 * Check Redux DevTools:
 * 1. Open Redux DevTools Chrome extension
 * 2. Look for auth slice changes (login/logout actions)
 * 3. Check api reducer for cached user data
 */

/**
 * Add debug logging:
 */

// In AuthCallbackPage:
useEffect(() => {
  console.log('Code:', code);
  console.log('State:', state);
  console.log('Is exchanging:', isExchanging);
  console.log('User:', user);
  console.log('Exchange error:', exchangeError);
}, [code, state, isExchanging, user, exchangeError]);

/**
 * Network tab:
 * 1. Open DevTools Network tab
 * 2. Check POST /api/auth/github/exchange:
 *    - Request body has code and state
 *    - Response has Set-Cookie header
 * 3. Check GET /api/users/me:
 *    - Request includes Cookie header
 *    - Response has user data
 */

/**
 * Check browser cookies:
 * 1. Open DevTools Application tab
 * 2. Look for session cookie under Cookies
 * 3. Verify it has:
 *    - HttpOnly flag
 *    - Secure flag (in production)
 *    - SameSite=Strict or Lax
 */

export {};
