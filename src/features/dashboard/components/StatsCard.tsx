/**
 * StatsCard - Dashboard statistic card
 * 
 * Displays a single stat with icon, value, and change indicator.
 * 
 * @feature dashboard
 */

import type { ReactNode } from 'react';
import { Card, CountUp } from '../../../shared/ui';

interface StatsCardProps {
  icon: ReactNode;
  iconColor: 'primary' | 'success' | 'warning' | 'purple';
  label: string;
  value: string | number;
  change?: string;
  description?: string;
}

export function StatsCard({
  icon,
  iconColor,
  label,
  value,
  change,
  description,
}: StatsCardProps) {
  const iconColorClass = `stat-icon ${iconColor}-icon`;

  return (
    <Card className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className={iconColorClass}>{icon}</span>
      </div>
      <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {change && <div className="stat-change positive">{change}</div>}
      {description && <p className="stat-description">{description}</p>}
    </Card>
  );
}

// ==========================================
// Staff Split Card Variant (Redesigned)
// ==========================================

interface StaffCardProps {
  icon: ReactNode;
  doctorCount: number;
  staffCount: number;
}

export function StaffCard({ icon, doctorCount, staffCount }: StaffCardProps) {
  const totalStaff = doctorCount + staffCount;
  
  return (
    <Card className="stat-card stat-card-elevated">
      <div className="stat-chart-header">
        <span className="stat-label">Staff Count</span>
        <span className="stat-icon-mini success-icon-mini">{icon}</span>
      </div>
      
      <div className="stat-value-large animated-value">
        <CountUp end={totalStaff} duration={2000} />
      </div>
      
      <div className="staff-breakdown">
        <div className="staff-item">
          <span className="staff-count">{doctorCount}</span>
          <span className="staff-type">Doctors</span>
        </div>
        <div className="staff-separator"></div>
        <div className="staff-item">
          <span className="staff-count">{staffCount}</span>
          <span className="staff-type">Staff</span>
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// Clinic Status Card (with pulsing indicator)
// ==========================================

interface ClinicStatusCardProps {
  icon: ReactNode;
  clinicName: string;
  status: 'Active' | 'Inactive';
  rating: number;
}

export function ClinicStatusCard({ icon, clinicName, status }: ClinicStatusCardProps) {
  return (
    <Card className="stat-card stat-card-elevated clinic-status-card-modern">
      <div className="clinic-card-header">
        <div className="clinic-info">
          <span className="stat-label">Clinic Status</span>
          <h3 className="clinic-name-title">{clinicName}</h3>
        </div>
        <div className="clinic-icon-wrapper pulse-icon">
          {icon}
        </div>
      </div>
      
      <div className="clinic-status-row">
        <div className={`status-badge-large ${status.toLowerCase()}`}>
          <span className="status-dot"></span>
          {status}
        </div>

      </div>
    </Card>
  );
}
