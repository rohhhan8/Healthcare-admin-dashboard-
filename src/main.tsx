/**
 * Application Entry Point
 * 
 * This is the entry point for the React application.
 * It renders the root App component into the DOM.
 * 
 * @architectural-rules
 * - Minimal setup code
 * - Import global styles
 * - StrictMode for development
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
