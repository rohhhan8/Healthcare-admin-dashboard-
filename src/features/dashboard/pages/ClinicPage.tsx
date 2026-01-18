/**
 * Clinics Page
 * 
 * Grid view of all subscribed clinics with detailed information.
 * 
 * @feature dashboard
 */

import { useState } from 'react';
import { mockData } from '../api';
import { BuildingIcon, UsersIcon, UserIcon, StarIcon } from '../../../shared/ui';

export function ClinicPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const clinics = mockData.clinics.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clinics-page">
      {/* Header / Toolbar */}
      <div className="page-header-row">
        <h1 className="page-title">Clinics Management</h1>
        <div className="search-box">
           <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          <input 
            type="text" 
            className="search-input-clean" 
            placeholder="Search clinics..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="clinics-grid">
        {clinics.map(clinic => (
          <div key={clinic.id} className="clinic-detail-card">
            {/* Header: Icon + Name + Status */}
            <div className="clinic-card-header">
              <div className="clinic-icon-large">
                <BuildingIcon />
              </div>
              <div className="clinic-info-primary">
                <h3 className="clinic-name">{clinic.name}</h3>
                <span className="clinic-location">{clinic.location}</span>
              </div>
              <span className={`status-badge ${clinic.status.toLowerCase()}`}>
                {clinic.status}
              </span>
            </div>

            {/* Divider */}
            <div className="card-divider"></div>

            {/* Stats Row */}
            <div className="clinic-stats-row">
              <div className="clinic-stat">
                <div className="stat-icon-tiny"><UserIcon /></div>
                <div className="stat-value-group">
                  <span className="stat-val">{clinic.doctorCount}</span>
                  <span className="stat-lbl">Doctors</span>
                </div>
              </div>
              <div className="clinic-stat">
                <div className="stat-icon-tiny"><UsersIcon /></div>
                <div className="stat-value-group">
                  <span className="stat-val">{clinic.staffCount}</span>
                  <span className="stat-lbl">Staff</span>
                </div>
              </div>
              <div className="clinic-stat">
                <div className="stat-icon-tiny text-yellow"><StarIcon /></div>
                <div className="stat-value-group">
                  <span className="stat-val">{clinic.rating}</span>
                  <span className="stat-lbl">Rating</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="clinic-contact-details">
              <div className="contact-item">
                <span className="label">Address:</span>
                <span className="value">{clinic.address}</span>
              </div>
              <div className="contact-item">
                <span className="label">Phone:</span>
                <span className="value">{clinic.phone}</span>
              </div>
              <div className="contact-item">
                <span className="label">Email:</span>
                <span className="value">{clinic.email}</span>
              </div>
            </div>

            {/* Action Footer */}
             <div className="clinic-card-footer">
               <button className="btn-text">View Details</button>
               <button className="btn-text text-primary">Edit</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
