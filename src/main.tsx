
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupOnlineListener } from './utils/offlineStorage';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });

  // Setup online listener to sync offline trades
  setupOnlineListener();
}

createRoot(document.getElementById("root")!).render(<App />);
