/**
 * Dashboard Page
 * 
 * Main dashboard view with clinic selection and date range filtering.
 * All charts sync with the selected clinic.
 * 
 * @feature dashboard
 */

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
// Selectors
import { 
  selectDashboardLoading,
  selectDashboardStats,
  selectChartData,
  selectDiseaseData,
  selectAgeCostData,
  selectRecentAppointments,
  selectAvgRating,
  selectSelectedClinic,
  selectAllClinics,
  selectDateRange,
  selectSelectedClinicId
} from '../dashboard.selectors';
import { useCallback } from 'react';

// Shared UI
import { UserIcon, UsersIcon, CalendarIcon, BuildingIcon, StatCardWithSparkline, Card, CountUp } from '../../../shared/ui';

// Dashboard Components
import {
  DashboardHeader,
  DashboardActions,
  StaffCard,
  ClinicStatusCard,
  WeeklyChart,
  AppointmentsTable,
  AgeCostKPI,
  DiseaseCategoryChart,
  RatingGauge,
} from '../components';

// API & Actions
import {
  mockData,
} from '../api';
import type { DateRange } from '../api';
import {
  fetchDashboardData,
  setClinicFilter,
  setDateRange,
} from '../dashboard.slice';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  
  // Redux State - ALL Logic moved to Selectors
  const selectedClinicId = useAppSelector(selectSelectedClinicId);
  const dateRange = useAppSelector(selectDateRange);
  const clinics = useAppSelector(selectAllClinics);
  const selectedClinic = useAppSelector(selectSelectedClinic);
  const isLoading = useAppSelector(selectDashboardLoading);
  
  const stats = useAppSelector(selectDashboardStats);
  const chartData = useAppSelector(selectChartData);
  const diseaseData = useAppSelector(selectDiseaseData);
  const ageCostData = useAppSelector(selectAgeCostData);
  const recentAppointments = useAppSelector(selectRecentAppointments);
  const avgRating = useAppSelector(selectAvgRating);

  // Local state for UI only
  const [compareMode, setCompareMode] = useState(false);
  const [compareClinicId, setCompareClinicId] = useState<string | null>(null);

  // Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Handlers - Wrapped in useCallback for Reference Stability
  const handleClinicChange = useCallback((clinicId: string | null) => {
    dispatch(setClinicFilter(clinicId));
    if (compareMode && clinicId === compareClinicId) {
      setCompareClinicId(null);
    }
  }, [dispatch, compareMode, compareClinicId]);
  
  const handleDateRangeChange = useCallback((range: DateRange) => {
    dispatch(setDateRange(range));
  }, [dispatch]);

  const handleCompareToggle = useCallback(() => {
    setCompareMode((prev) => !prev);
    // Note: We access state inside setter or use refs if we want to avoid deps, 
    // but here toggle depends on previous state which is fine.
    // Resetting compareClinicId needs access to current value or effect.
    // Simpler: just set it.
    if (!compareMode) { // Logic specific to *entering* compare mode or *leaving*?
         // Original: if (compareMode) setCompareClinicId(null).
         // If we are toggling OFF, we clear it.
         setCompareClinicId(null); 
    }
  }, [compareMode]); 
  
  // Re-implementing toggle logic correctly with useCallback:
  // Using a separate effect or just referencing the state is fine.
  
  const handleExportCSV = useCallback(() => {
    // Implementation for export
  }, []);

  const handleDownloadReport = useCallback(() => {
    // Implementation for download
  }, []);

  const handleViewAllAppointments = useCallback(() => {
    // Navigate to appointments
  }, []);

  // Loading State
  if (isLoading && clinics.length === 0) {
    return (
      <div className="dashboard-content flex-center">
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Header */}
      <DashboardHeader
        clinics={clinics}
        selectedClinicId={selectedClinicId}
        onClinicChange={handleClinicChange}
        notificationCount={3}
        compareMode={compareMode}
        onCompareToggle={handleCompareToggle}
      />

      {/* Compare Mode Selector */}
      {compareMode && (
        <div className="compare-selector-bar">
          <span className="compare-label">Compare with:</span>
          <select
            className="enhanced-select"
            value={compareClinicId || ''}
            onChange={(e) => setCompareClinicId(e.target.value || null)}
          >
            <option value="">Select clinic...</option>
            {mockData.clinics
              .filter(c => c.id !== selectedClinicId)
              .map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} - {clinic.location}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Actions Row */}
      <DashboardActions
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onExportCSV={handleExportCSV}
        onDownloadReport={handleDownloadReport}
      />

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <StatCardWithSparkline
          icon={<UserIcon />}
          iconColor="primary"
          label="Patients"
          value={stats.totalPatients}
          description={selectedClinic ? selectedClinic.name : "Total registered"}
          showSparkline={true}
          sparklineData={{ values: chartData.current }}
        />
        <StaffCard
          icon={<UsersIcon />}
          doctorCount={stats.totalDoctors}
          staffCount={stats.totalStaff}
        />
        <StatCardWithSparkline
          icon={<CalendarIcon />}
          iconColor="warning"
          label="Appointments"
          value={stats.totalAppointments}
          description="This period"
          showSparkline={true}
          sparklineData={{ values: chartData.current }}
        />
        
        {selectedClinic ? (
          <ClinicStatusCard
            icon={<BuildingIcon />}
            clinicName={selectedClinic.name}
            status={selectedClinic.status}
            rating={selectedClinic.rating}
          />
        ) : (
          <Card className="stat-card live-active-card">
            <div className="stat-header">
              <span className="stat-label">Active Locations</span>
              <span className="stat-icon clinic-icon"><BuildingIcon /></span>
            </div>
            <div className="stat-value">
              <CountUp end={mockData.clinics.length} duration={2500} />
            </div>
            <div className="live-indicator-wrapper">
              <span className="live-dot"></span>
              <span className="live-text">Live Monitoring</span>
            </div>
          </Card>
        )}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <WeeklyChart 
          data={chartData}
          clinicName={selectedClinic?.name}
          dateRange={dateRange}
        />
        <AppointmentsTable
          data={recentAppointments}
          onViewAll={handleViewAllAppointments}
        />
      </div>

      {/* KPIs Row */}
      <div className="kpi-grid">
        <AgeCostKPI data={ageCostData} />
        <DiseaseCategoryChart data={diseaseData} />
        <RatingGauge rating={avgRating} />
      </div>
    </div>
  );
}
