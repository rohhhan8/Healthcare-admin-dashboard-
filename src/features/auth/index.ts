/**
 * Auth Feature - Public API
 * 
 * Barrel exports for the auth feature.
 * Only export what other parts of the app need to access.
 */

// Pages
export { LoginPage } from './pages/LoginPage';

// Slice
export {
    authSlice,
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    selectCurrentUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
} from './auth.slice';

// Types
export type { User, AuthState } from './auth.slice';
