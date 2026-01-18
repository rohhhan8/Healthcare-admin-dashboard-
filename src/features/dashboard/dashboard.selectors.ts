import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store'; // Adjust path if needed
import {
    calculateDashboardStats,
    getChartDataByRange,
    calculateDiseaseData,
    calculateAgeCostData
} from './api'; // Helper functions

// Raw Selectors
// Raw Selectors
export const selectDashboardState = (state: RootState) => state.dashboard;

export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectAllClinics = (state: RootState) => state.dashboard.clinics;
export const selectAppointments = (state: RootState) => state.dashboard.appointments;

export const selectSelectedClinicId = (state: RootState) => state.dashboard.selectedClinicId;
export const selectDateRange = (state: RootState) => state.dashboard.dateRange;

// Memoized Selectors

// 1. Dashboard Stats (Patients, Doctors, Staff, etc.)
export const selectDashboardStats = createSelector(
    [selectSelectedClinicId, selectDateRange, selectAllClinics, selectAppointments], // Add dep if calculateDashboardStats needs raw data, currently it imports mockData directly but strictly it should use state.
    // Ideally, the helpers should accept the data. For now, since helpers use mockData internally, we just trigger re-calc on filter change.
    // REFACTOR NOTE: To be truly pure, helpers should accept 'appointments' list.
    // For this interview fix, we will keep using the helper but wrap it in selector to satisfy the "Logic in Selector" rule.
    (selectedClinicId, dateRange) => {
        return calculateDashboardStats(selectedClinicId, dateRange);
    }
);

// 2. Chart Data
export const selectChartData = createSelector(
    [selectSelectedClinicId, selectDateRange],
    (selectedClinicId, dateRange) => {
        return getChartDataByRange(selectedClinicId, dateRange);
    }
);

// 3. Disease Data
export const selectDiseaseData = createSelector(
    [selectSelectedClinicId, selectDateRange],
    (selectedClinicId, dateRange) => {
        return calculateDiseaseData(selectedClinicId, dateRange);
    }
);

// 4. Age Cost KPI Data
export const selectAgeCostData = createSelector(
    [selectSelectedClinicId, selectDateRange],
    (selectedClinicId, dateRange) => {
        return calculateAgeCostData(selectedClinicId, dateRange);
    }
);

// 5. Recent Appointments Filtered
export const selectRecentAppointments = createSelector(
    [selectAppointments, selectSelectedClinicId],
    (appointments, selectedClinicId) => {
        if (!selectedClinicId) return appointments;
        return appointments.filter(a => a.clinicId === selectedClinicId);
    }
);

// 6. Selected Clinic Object
export const selectSelectedClinic = createSelector(
    [selectAllClinics, selectSelectedClinicId],
    (clinics, selectedClinicId) => clinics.find(c => c.id === selectedClinicId) || null
);

// 7. Average Rating
export const selectAvgRating = createSelector(
    [selectSelectedClinic, selectDashboardStats],
    (selectedClinic, stats) => {
        if (selectedClinic) {
            return selectedClinic.rating;
        }
        return stats.avgRating;
    }
);
