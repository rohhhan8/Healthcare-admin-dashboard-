/**
 * Redux Store Configuration
 * 
 * Central store setup using Redux Toolkit.
 * All feature slices are combined here.
 * 
 * @architectural-rules
 * - Only import slices from features/
 * - No business logic
 * - Export RootState and AppDispatch types
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import dashboardReducer from '../features/dashboard/dashboard.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
    },
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
