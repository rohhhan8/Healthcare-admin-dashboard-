/**
 * Dashboard API - Barrel Export
 * 
 * All API functions and mock data for the dashboard feature.
 * 
 * @feature dashboard
 * @layer api
 */

// Mock Data Generator
export {
    generateMockData,
    mockData,
    calculateDashboardStats,
    calculateWeeklyChartData,
    calculateMonthlyChartData,
    calculateDiseaseData,
    calculateAgeCostData,
    getChartDataByRange,
} from './mockData';

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
    AgeCostData,
} from './mockData';
