/**
 * Patients Page
 * 
 * Display patient records with clean table design and pagination.
 * Fewer rows per page for full visibility without scrolling.
 * 
 * @feature dashboard
 */

import { useState, useMemo } from 'react';
import { mockData } from '../api';

// Records per page (fewer to avoid scrolling)
const RECORDS_PER_PAGE = 9;

// Condition badge colors
const CONDITION_COLORS: Record<string, string> = {
  Critical: 'condition-critical',
  Chronic: 'condition-chronic',
  Acute: 'condition-acute',
  Flu: 'condition-flu',
  Routine: 'condition-routine',
};

// Available conditions for filter
const CONDITIONS = ['All', 'Critical', 'Chronic', 'Acute', 'Flu', 'Routine'];

export function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCondition, setFilterCondition] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const patients = mockData.patients;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const newThisWeek = patients.filter(p => new Date(p.admissionDate) >= weekAgo).length;
    const criticalCount = patients.filter(p => p.condition === 'Critical').length;
    const avgAge = Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length);
    
    return {
      total: patients.length,
      newThisWeek,
      critical: criticalCount,
      avgAge,
    };
  }, []);

  // Filter patients by search and condition
  const filteredPatients = useMemo(() => {
    let patients = mockData.patients;
    
    // Filter by condition
    if (filterCondition !== 'All') {
      patients = patients.filter(p => p.condition === filterCondition);
    }
    
    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.condition.toLowerCase().includes(term)
      );
    }
    
    return patients;
  }, [searchTerm, filterCondition]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };

  // Generate phone number
  const getPhone = (id: string) => {
    const num = parseInt(id.replace(/\D/g, '').slice(-4)) || 1234;
    return `+91 ${98760 + (num % 10000).toString().padStart(5, '0')}`;
  };

  return (
    <div className="patients-page">
      {/* Stats Cards */}
      <div className="patients-stats">
        <div className="doctor-stat-card patient-stat-card-outline">
          <div className="stat-content">
            <span className="stat-number">{stats.total.toLocaleString()}</span>
            <span className="stat-text">Total Patients</span>
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

        <div className="doctor-stat-card patient-stat-card-outline">
          <div className="stat-content">
            <span className="stat-number">{stats.newThisWeek}</span>
            <span className="stat-text">New This Week</span>
          </div>
          <div className="stat-icon-small stat-icon-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="doctor-stat-card patient-stat-card-outline">
          <div className="stat-content">
            <span className="stat-number">{stats.critical}</span>
            <span className="stat-text">Critical</span>
          </div>
          <div className="stat-icon-small stat-icon-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="doctor-stat-card patient-stat-card-outline">
          <div className="stat-content">
            <span className="stat-number">{stats.avgAge}</span>
            <span className="stat-text">Average Age</span>
          </div>
          <div className="stat-icon-small stat-icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="patients-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input-clean"
              placeholder="Search patient.."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="filter-dropdown-wrapper">
            <button 
              className={`toolbar-btn ${filterCondition !== 'All' ? 'toolbar-btn-active' : ''}`}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {filterCondition === 'All' ? 'Filter' : filterCondition}
            </button>
            {showFilterDropdown && (
              <div className="filter-dropdown">
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    className={`filter-option ${filterCondition === c ? 'active' : ''}`}
                    onClick={() => { setFilterCondition(c); setShowFilterDropdown(false); setCurrentPage(1); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="toolbar-btn toolbar-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
        <div className="toolbar-right">
          <span className="record-count-label">{filteredPatients.length} patients</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="patients-table-wrapper">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Appointment</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Condition</th>
              <th>Blood Group</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <div className="patient-name-cell">
                    <div className="patient-avatar">
                      {patient.name.charAt(0)}
                    </div>
                    <span className="patient-name">{patient.name}</span>
                  </div>
                </td>
                <td>{formatDate(patient.admissionDate)}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>
                  <span className={`condition-badge ${CONDITION_COLORS[patient.condition] || 'condition-routine'}`}>
                    {patient.condition}
                  </span>
                </td>
                <td>{patient.bloodGroup}</td>
                <td className="cell-phone">{getPhone(patient.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="patients-pagination">
        <div className="pagination-left">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Previous
          </button>
          <div className="pagination-numbers">
            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="pagination-right">
          <span className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} entries
          </span>
        </div>
      </div>
    </div>
  );
}
