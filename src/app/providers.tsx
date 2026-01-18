/**
 * Global Providers
 * 
 * Wraps the application with all necessary providers:
 * - Redux Provider (store)
 * - Router Provider
 * - Theme Provider (when added)
 * 
 * @architectural-rules
 * - Only provider wrappers
 * - No business logic
 * - No UI components
 */

import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { router } from './router';

export function Providers() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
