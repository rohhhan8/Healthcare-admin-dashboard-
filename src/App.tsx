/**
 * Root Application Component
 * 
 * Minimal root component that renders the global Providers.
 * 
 * @architectural-rules
 * - Minimal code
 * - Only renders Providers
 * - No business logic
 * - No direct feature imports
 */

import { Providers } from './app/providers';

function App() {
  return <Providers />;
}

export default App;
