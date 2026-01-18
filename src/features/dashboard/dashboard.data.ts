/**
 * Dashboard Data
 * 
 * Mock data and API calls for the dashboard feature.
 * 
 * @feature dashboard
 */

// ==========================================
// Types
// ==========================================

export interface DashboardStats {
    patients: {
        count: number;
        change: string;
    };
    staff: {
        doctors: number;
        staff: number;
    };
    appointments: {
        count: number;
        change: string;
    };
    clinics: {
        count: number;
    };
}

export interface Appointment {
    id: number;
    patient: string;
    doctor: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface AgeGroupCost {
    ageGroup: string;
    cost: number;
    percentage: number;
}

export interface DiseaseCategory {
    name: string;
    percentage: number;
    color: string;
}

export interface RatingBreakdown {
    label: string;
    percentage: number;
}

// ==========================================
// Mock Data
// ==========================================

export const dashboardStats: DashboardStats = {
    patients: { count: 4592, change: '+15.9%' },
    staff: { doctors: 260, staff: 45 },
    appointments: { count: 540, change: '+15.9%' },
    clinics: { count: 12 },
};

export const recentAppointments: Appointment[] = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Sarah Wilson', date: '2024-01-17', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Emily Johnson', doctor: 'Dr. Michael Brown', date: '2024-01-17', time: '11:30 AM', status: 'Pending' },
    { id: 3, patient: 'Robert Davis', doctor: 'Dr. Sarah Wilson', date: '2024-01-17', time: '02:00 PM', status: 'Confirmed' },
    { id: 4, patient: 'Maria Garcia', doctor: 'Dr. James Lee', date: '2024-01-17', time: '03:30 PM', status: 'Cancelled' },
    { id: 5, patient: 'David Wilson', doctor: 'Dr. Michael Brown', date: '2024-01-17', time: '04:00 PM', status: 'Confirmed' },
];

export const ageGroupCosts: AgeGroupCost[] = [
    { ageGroup: '18-25', cost: 120, percentage: 45 },
    { ageGroup: '26-35', cost: 180, percentage: 65 },
    { ageGroup: '36-50', cost: 250, percentage: 80 },
    { ageGroup: '50+', cost: 320, percentage: 95 },
];

export const diseaseCategories: DiseaseCategory[] = [
    { name: 'Cardio', percentage: 70, color: '#3F72AF' },
    { name: 'Ortho', percentage: 55, color: '#DBE2EF' },
    { name: 'General', percentage: 85, color: '#112D4E' },
    { name: 'Dental', percentage: 45, color: '#3F72AF' },
    { name: 'Neuro', percentage: 60, color: '#DBE2EF' },
];

export const ratingBreakdown: RatingBreakdown[] = [
    { label: 'Excellent', percentage: 68 },
    { label: 'Good', percentage: 24 },
    { label: 'Average', percentage: 8 },
];

export const overallRating = 4.5;

export const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-year', label: 'This Year' },
];

// ==========================================
// API Functions (to be implemented)
// ==========================================

// export async function fetchDashboardStats(): Promise<DashboardStats> { }
// export async function fetchRecentAppointments(): Promise<Appointment[]> { }
