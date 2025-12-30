import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for caching with proper cleanup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Unregister all old service workers first
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      })
      .catch(() => {
        // Continue even if unregister fails
      });

    // Then register the new service worker
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          // Check for updates
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === 'activated') {
                  console.log('Service Worker updated');
                }
              };
            }
          };
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }, 500);
  });
}
