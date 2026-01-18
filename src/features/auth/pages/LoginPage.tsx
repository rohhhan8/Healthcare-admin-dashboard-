/**
 * Login Page
 * 
 * Secure entry point for the application.
 * Features a split layout with branding and a professional login form.
 * 
 * @feature auth
 */

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loginStart, loginSuccess, loginFailure, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../auth.slice';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [email, setEmail] = useState('admin@raga.ai');
  const [password, setPassword] = useState('password');

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
        dispatch(loginFailure('Please enter both email and password'));
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(loginFailure('Please enter a valid email address'));
      return;
    }

    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      if (email === 'admin@raga.ai' && password === 'password') {
        dispatch(loginSuccess({
          user: {
            id: '1',
            email: 'admin@raga.ai',
            name: 'Dr. Rohan', // Customized for user
          },
          token: 'mock-jwt-token-123456',
        }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('Invalid email or password'));
      }
    }, 1500);
  };

  return (
    <div className="login-wrapper">
      {/* Left Side - Branding & Visuals */}
      <div className="login-sidebar">
        <div className="login-brand">
          <div className="brand-logo-large">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="brand-name-large">Raga Healthcare Systems</h1>
        </div>
        <div className="login-quote">
          <p>"Transforming healthcare with advanced AI analytics."</p>
          <span>Enterprise Dashboard</span>
        </div>
        <div className="login-pattern"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-main">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-extra">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="sc-spinner"></span>
              ) : (
                <>
                  Sign In
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="#">Contact Support</a></p>
          </div>
          
          <div className="demo-credentials">
            <small>Demo: admin@raga.ai / password</small>
          </div>
        </div>
      </div>
    </div>
  );
}
