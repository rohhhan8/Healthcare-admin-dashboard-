/**
 * Protected Route Guard Component
 * 
 * Wraps protected routes and redirects unauthenticated users to login.
 * Connected to Redux auth state.
 * 
 * @architectural-rules
 * - App-level guard, not feature-specific
 * - Uses Redux selector for auth state
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks';
import { selectIsAuthenticated } from '../features/auth/auth.slice';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
