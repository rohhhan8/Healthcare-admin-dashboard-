/**
 * Dashboard Feature - Redux Slice
 *
 * State management for the dashboard feature.
 * Handles global filters (date range, selected clinic) and cached data.
 *
 * @architectural-rules
 * - Self-contained dashboard logic
 * - Uses async thunks for data fetching (simulating API)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { mockData, type Clinic, type Doctor, type Patient, type Appointment, type MockData } from './api/mockData';

// ==========================================
// Types
// ==========================================

export type DateRange = 'this-week' | 'this-month' | 'this-year';

export interface DashboardState {
    clinics: Clinic[];
    doctors: Doctor[];
    patients: Patient[];
    appointments: Appointment[];

    // Filters
    selectedClinicId: string | null;
    dateRange: DateRange;

    // Status
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

const initialState: DashboardState = {
    clinics: [],
    doctors: [],
    patients: [],
    appointments: [],
    selectedClinicId: null,
    dateRange: 'this-week',
    isLoading: false,
    error: null,
    lastUpdated: null,
};

// ==========================================
// Async Thunks
// ==========================================

// Simulate API call to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // In a real app, this would be an API call: const response = await api.get('/dashboard');
            return mockData;
        } catch (error) {
            return rejectWithValue('Failed to fetch dashboard data');
        }
    }
);

// ==========================================
// Slice
// ==========================================

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setClinicFilter: (state, action: PayloadAction<string | null>) => {
            state.selectedClinicId = action.payload;
        },
        setDateRange: (state, action: PayloadAction<DateRange>) => {
            state.dateRange = action.payload;
        },
        resetFilters: (state) => {
            state.selectedClinicId = null;
            state.dateRange = 'this-week';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<MockData>) => {
                state.isLoading = false;
                state.clinics = action.payload.clinics;
                state.doctors = action.payload.doctors;
                state.patients = action.payload.patients;
                state.appointments = action.payload.appointments;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// ==========================================
// Actions
// ==========================================

export const { setClinicFilter, setDateRange, resetFilters } = dashboardSlice.actions;

// Selectors are now in dashboard.selectors.ts

// ==========================================
// Reducer Export
// ==========================================

export default dashboardSlice.reducer;
