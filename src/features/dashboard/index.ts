/**
 * Dashboard Feature - Main Export
 * 
 * Exports all dashboard components, pages, and data.
 * 
 * @feature dashboard
 */

// Pages
export { DashboardPage } from './pages/DashboardPage';
export { ClinicPage } from './pages/ClinicPage';

// Components
export {
    DashboardHeader,
    DashboardActions,
    StatsCard,
    StaffCard,
    ClinicStatusCard,
    WeeklyChart,
    AppointmentsTable,
    AgeCostKPI,
    DiseaseCategoryChart,
    RatingGauge,
} from './components';

// API
export {
    mockData,
    calculateDashboardStats,
    calculateWeeklyChartData,
    calculateMonthlyChartData,
    calculateDiseaseData,
} from './api';

// Types
export type {
    Clinic,
    Doctor,
    Patient,
    Appointment,
    MockData,
    DashboardStats,
    ComparisonStats,
    ChartData,
    DateRange,
} from './api';
