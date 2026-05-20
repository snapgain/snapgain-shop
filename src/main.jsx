// 2026-05-20 (v2): snapgain.shop is marketing-only now (auth moved
// to main app). AuthProvider and Stripe Elements are no longer
// needed at the root — landing page CTAs go to snapgain.uk for
// signup/checkout.
//
// Old wrappers kept commented for fast revert if we ever bring back
// the calculator product flow here.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import '@/styles/design-tokens.css';
// import { AuthProvider } from '@/contexts/SupabaseAuthContext';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_live_…');

// Service worker only registers on the live shop domain (skips local
// dev + the snapgain.uk main app).
if (import.meta.env.PROD && window.location.hostname === 'snapgain.shop') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
