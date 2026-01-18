/**
 * DashboardHeader - Enhanced header with clinic selector dropdown
 * 
 * Contains clinic selector, theme slide toggle, and notifications.
 * 
 * @feature dashboard
 */

import { useState, useEffect } from 'react';
import { IconButton, BellIcon } from '../../../shared/ui';
import type { Clinic } from '../api';

interface DashboardHeaderProps {
  clinics: Clinic[];
  selectedClinicId: string | null;
  onClinicChange: (clinicId: string | null) => void;
  notificationCount?: number;
  compareMode?: boolean;
  onCompareToggle?: () => void;
}

export function DashboardHeader({
  clinics,
  selectedClinicId,
  onClinicChange,
  notificationCount = 0,
  compareMode = false,
  onCompareToggle,
}: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    return false;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  // Toggle theme
  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark if no theme is saved, or if saved is 'dark'
    if (!savedTheme || savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleClinicSelect = (clinicId: string | null) => {
    onClinicChange(clinicId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="dashboard-header">
      {/* Title */}
      <div className="header-left">
        <h1 className="dashboard-title">
          {selectedClinic ? selectedClinic.name : 'All Clinics Overview'}
        </h1>
      </div>
      
      {/* Actions */}
      <div className="header-right">
        {/* Clinic Selector (Moved here) */}
        <div className="clinic-selector-wrapper">
          <button 
            className="clinic-selector-btn robust-dropdown" 
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <LocationIcon />
            <span>{selectedClinic ? selectedClinic.location : 'Overall View'}</span>
            <ChevronIcon isOpen={isDropdownOpen} />
          </button>
          
          {isDropdownOpen && (
            <div className="clinic-dropdown-menu right-aligned">
              <div className="dropdown-header">Select Location</div>
              <div 
                className={`dropdown-item ${!selectedClinicId ? 'active' : ''}`}
                onClick={() => handleClinicSelect(null)}
              >
                <div className="dropdown-item-content">
                  <span className="dropdown-item-name">Overall View</span>
                  <span className="dropdown-item-meta">All Clinics Overview</span>
                </div>
              </div>
              {clinics.map(clinic => (
                <div 
                  key={clinic.id}
                  className={`dropdown-item ${selectedClinicId === clinic.id ? 'active' : ''}`}
                  onClick={() => handleClinicSelect(clinic.id)}
                >
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-name">{clinic.name}</span>
                    <span className="dropdown-item-meta">
                      {clinic.location}
                    </span>
                  </div>
                  <span className={`status-badge ${clinic.status.toLowerCase()}`}>
                    {clinic.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className={`compare-toggle ${compareMode ? 'active' : ''}`}
          onClick={onCompareToggle}
        >
          <CompareIcon />
          Compare
        </button>
        
        {/* Theme Slide Toggle */}
        <div className="theme-slide-toggle">
          <SunIcon />
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isDark} 
              onChange={handleThemeToggle}
            />
            <span className="toggle-slider"></span>
          </label>
          <MoonIcon />
        </div>
        
        <IconButton
          icon={<BellIcon />}
          badge={notificationCount}
          aria-label="Notifications"
        />
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg 
      width="12" height="12" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}
