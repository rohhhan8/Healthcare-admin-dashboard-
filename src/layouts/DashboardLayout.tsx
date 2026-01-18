/**
 * Dashboard Layout Component
 * 
 * Main layout for authenticated pages with static sidebar.
 * 
 * @architectural-rules
 * - Layout structure only
 * - Uses shared/ui components
 * - Renders children via Outlet (React Router)
 */

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectCurrentUser } from '../features/auth/auth.slice';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';

// Menu items for the sidebar
const menuItems = [
  {
    section: 'Main',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
      { name: 'Doctors', path: '/doctors', icon: DoctorsIcon },
      { name: 'Patients', path: '/patients', icon: PatientsIcon },
      { name: 'Appointments', path: '/appointments', icon: AppointmentsIcon },
      { name: 'Clinic', path: '/clinic', icon: ClinicIcon },
    ],
  },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {/* <div className="sidebar-brand-icon">R</div> */}
            <span className="sidebar-brand-text">Raga Healthcare Systems</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((section) => (
            <div key={section.section} className="nav-section">
              <div className="nav-section-title">{section.section}</div>
              <ul className="nav-list">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                    >
                      <span className="nav-link-icon">
                        <item.icon />
                      </span>
                      <span className="nav-link-text">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* Company Branding */}
        <div className="sidebar-company">
          <span className="company-label">Admin Portal</span>
          <span className="company-name">Raga Healthcare Systems</span>
        </div>

        {/* User Profile */}
        {/* User Profile & Logout - Compact Side-by-Side */}
        <div className="sidebar-footer">
          <div className="user-bar">
            {/* User Profile */}
            <div className="user-avatar-small">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="user-info-text">
              <span className="user-name-small">{currentUser?.name || 'Admin'}</span>
              <span className="user-role-label">Administrator</span>
            </div>
          </div>
          
          {/* Separate Logout Button */}
          <button onClick={handleLogout} className="logout-btn-animated" title="Sign Out">
            <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
          <h1 className="header-title">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="header-actions">
            {/* Header actions will be added later */}
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Helper to get page title from path
function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/doctors': 'Doctors',
    '/patients': 'Patients',
    '/appointments': 'Appointments',
    '/clinic': 'Clinic',
  };
  return titles[path] || 'Dashboard';
}

// ==========================================
// Icons (inline SVG components)
// ==========================================

function DashboardIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function DoctorsIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PatientsIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function AppointmentsIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ClinicIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
