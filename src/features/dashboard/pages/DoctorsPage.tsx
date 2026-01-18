/**
 * Doctors Page
 * 
 * Display doctors in a grid card layout with all details.
 * Consistent design with the rest of the app.
 * 
 * @feature dashboard
 */

import { useState, useMemo } from 'react';
import { mockData } from '../api';

// Status colors
const STATUS_COLORS: Record<string, string> = {
  Available: 'doctor-status-available',
  Busy: 'doctor-status-busy',
  'On Leave': 'doctor-status-leave',
};

export function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const doctors = mockData.doctors;
    const available = doctors.filter(d => d.status === 'Available').length;
    const busy = doctors.filter(d => d.status === 'Busy').length;
    const onLeave = doctors.filter(d => d.status === 'On Leave').length;
    
    return {
      total: doctors.length,
      available,
      busy,
      onLeave,
    };
  }, []);

  // Filter doctors by search
  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return mockData.doctors;
    const term = searchTerm.toLowerCase();
    return mockData.doctors.filter(d => 
      d.name.toLowerCase().includes(term) ||
      d.specialization.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Get clinic name by ID
  const getClinicName = (clinicId: string) => {
    const clinic = mockData.clinics.find(c => c.id === clinicId);
    return clinic ? clinic.name : 'Unknown';
  };

  // Generate phone number
  const getPhone = (id: string) => {
    const num = parseInt(id.replace(/\D/g, '').slice(-4)) || 1234;
    return `+91 ${99880 + (num % 10000).toString().padStart(5, '0')}`;
  };

  return (
    <div className="doctors-page">
      {/* Stats Cards */}
      <div className="doctors-stats">
        <div className="doctor-stat-card">
          <div className="stat-accent stat-accent-primary"></div>
          <div className="stat-content">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-text">Total Doctors</span>
          </div>
          <div className="stat-icon-small">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="stat-accent stat-accent-teal"></div>
          <div className="stat-content">
            <span className="stat-number">{stats.available}</span>
            <span className="stat-text">Available</span>
          </div>
          <div className="stat-icon-small stat-icon-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="stat-accent stat-accent-amber"></div>
          <div className="stat-content">
            <span className="stat-number">{stats.busy}</span>
            <span className="stat-text">Busy</span>
          </div>
          <div className="stat-icon-small stat-icon-amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        </div>

        <div className="doctor-stat-card patient-stat-card-outline">
          <div className="stat-content">
            <span className="stat-number">{stats.onLeave}</span>
            <span className="stat-text">On Leave</span>
          </div>
          <div className="stat-icon-small stat-icon-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="doctors-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input-clean"
              placeholder="Search doctors.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="toolbar-btn toolbar-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Doctor
          </button>
        </div>
        <div className="toolbar-right">
          <span className="record-count-label">{filteredDoctors.length} doctors</span>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="doctors-grid">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card doctor-card-compact">
            {/* Status badge in top-right */}
            <span className={`doctor-status-badge ${STATUS_COLORS[doctor.status]}`}>
              {doctor.status}
            </span>
            
            <h3 className="doctor-name-compact">{doctor.name}</h3>
            <span className="doctor-specialization-compact">{doctor.specialization}</span>
            
            <div className="doctor-details-compact">
              <div className="doctor-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{getClinicName(doctor.clinicId)}</span>
              </div>
              <div className="doctor-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                </svg>
                <span>{getPhone(doctor.id)}</span>
              </div>
              <div className="doctor-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>{doctor.experience} yrs exp</span>
              </div>
              <div className="doctor-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="doctor-email">{doctor.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
