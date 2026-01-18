/**
 * Appointments Page
 * 
 * Full appointments management with stats, search, filter, and pagination.
 * 
 * @feature dashboard
 */

import { useState, useMemo } from 'react';
import { Card, CardHeader, Badge, StatCardWithSparkline, StatCardWithCountUp, CalendarIcon } from '../../../shared/ui';
import { useAppSelector } from '../../../app/hooks';
import { selectAppointments } from '../dashboard.selectors';
import { calculateWeeklyChartData } from '../api';
import type { Appointment } from '../api';

// CheckIcon for completed appointments
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// XIcon for cancelled appointments
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ClockIcon for scheduled appointments
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

const ITEMS_PER_PAGE = 8;

export function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Get chart data for sparklines
  const chartData = useMemo(() => calculateWeeklyChartData(), []);

  // Redux
  const allAppointments = useAppSelector(selectAppointments) || [];

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: allAppointments.length,
      completed: allAppointments.filter(a => a.status === 'Completed').length,
      scheduled: allAppointments.filter(a => a.status === 'Scheduled').length,
      cancelled: allAppointments.filter(a => a.status === 'Cancelled').length,
    };
  }, [allAppointments]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let appointments = [...allAppointments];
    
    // Status filter
    if (statusFilter !== 'All') {
      appointments = appointments.filter(a => a.status === statusFilter);
    }
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      appointments = appointments.filter(a =>
        a.patientName.toLowerCase().includes(term) ||
        a.doctorName.toLowerCase().includes(term) ||
        a.clinicName.toLowerCase().includes(term)
      );
    }
    
    return appointments;
  }, [searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get short clinic name
  const getShortClinicName = (clinicName: string) => {
    return clinicName.split(' ').slice(0, 2).join(' ');
  };

  // Status badge mapping
  const getStatusBadge = (status: Appointment['status']) => {
    const statusMap: Record<string, 'confirmed' | 'pending' | 'cancelled'> = {
      'Completed': 'confirmed',
      'Scheduled': 'pending',
      'Cancelled': 'cancelled',
    };
    return statusMap[status] || 'pending';
  };

  return (
    <div className="patients-page appointments-page">
      {/* Stats Cards */}
      <div className="patients-stats">
        <StatCardWithSparkline
          icon={<CalendarIcon />}
          iconColor="primary"
          label="Total Appointments"
          value={stats.total}
          showSparkline={true}
          sparklineData={{ values: chartData.current }}
        />
        <StatCardWithCountUp
          icon={<CheckIcon />}
          iconColor="success"
          label="Completed"
          value={stats.completed}
        />
        <StatCardWithCountUp
          icon={<ClockIcon />}
          iconColor="warning"
          label="Scheduled"
          value={stats.scheduled}
        />
        <StatCardWithCountUp
          icon={<XIcon />}
          iconColor="purple"
          label="Cancelled"
          value={stats.cancelled}
        />
      </div>

      {/* Toolbar */}
      <div className="patients-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input-clean"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn toolbar-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <Card className="data-table-card">
        <CardHeader
          title="Appointments List"
          action={<span className="record-count">{filteredAppointments.length} records</span>}
        />
        <div className="patients-table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Clinic</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar">
                        {appointment.patientName.charAt(0)}
                      </div>
                      <span className="patient-name">{appointment.patientName}</span>
                    </div>
                  </td>
                  <td>{appointment.doctorName}</td>
                  <td>
                    <span className="clinic-tag">{getShortClinicName(appointment.clinicName)}</span>
                  </td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <Badge status={getStatusBadge(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="patients-pagination">
        <div className="pagination-left">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
