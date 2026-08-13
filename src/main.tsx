import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite WebSocket HMR disconnection error overlays
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || event.reason || '';
  if (
    typeof reason === 'string' &&
    (reason.includes('WebSocket') || reason.includes('vite') || reason.includes('ws'))
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (
    typeof msg === 'string' &&
    (msg.includes('WebSocket') || msg.includes('vite') || msg.includes('ws'))
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
