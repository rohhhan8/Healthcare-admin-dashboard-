/**
 * Auth Slice - Authentication State Management
 * 
 * Contains: state, reducers, and selectors for authentication.
 * 
 * @architectural-rules
 * - Self-contained auth logic
 * - Persists auth state to localStorage
 * - No API calls here (use thunks in auth.data.ts later)
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// ==========================================
// Types
// ==========================================

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// Initial State (with localStorage persistence)
// ==========================================

const getInitialAuthState = (): AuthState => {
  // Check localStorage for existing token/auth
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (storedToken && storedUser) {
    try {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    } catch {
      // Invalid stored data, clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

// ==========================================
// Slice
// ==========================================

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
  },
});

// ==========================================
// Actions
// ==========================================

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// ==========================================
// Selectors
// ==========================================

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// ==========================================
// Reducer Export
// ==========================================

export default authSlice.reducer;
