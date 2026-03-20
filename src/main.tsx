import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress THREE.Clock deprecation warning from @react-three/fiber
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
  originalConsoleWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
