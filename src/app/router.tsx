/**
 * Application Router Configuration
 * 
 * Central routing configuration for the entire application.
 * All routes are defined here - feature folders do NOT contain routing.
 * 
 * @architectural-rules
 * - Import pages from features/[feature]/pages/
 * - Import layouts from layouts/
 * - Route protection via ProtectedRoute guard
 * - No business logic
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Auth pages
import { LoginPage } from '../features/auth/pages/LoginPage';

// Dashboard pages
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { DoctorsPage } from '../features/dashboard/pages/DoctorsPage';
import { PatientsPage } from '../features/dashboard/pages/PatientsPage';
import { AppointmentsPage } from '../features/dashboard/pages/AppointmentsPage';
import { ClinicPage } from '../features/dashboard/pages/ClinicPage';

export const router = createBrowserRouter([
  // ==========================================
  // PUBLIC ROUTES (No authentication required)
  // ==========================================
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ==========================================
  // PROTECTED ROUTES (Authentication required)
  // ==========================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/doctors',
            element: <DoctorsPage />,
          },
          {
            path: '/patients',
            element: <PatientsPage />,
          },
          {
            path: '/appointments',
            element: <AppointmentsPage />,
          },
          {
            path: '/clinic',
            element: <ClinicPage />,
          },
        ],
      },
    ],
  },

  // ==========================================
  // REDIRECTS & FALLBACKS
  // ==========================================
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
