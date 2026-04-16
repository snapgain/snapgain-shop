import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import '@/styles/design-tokens.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51SRE8rPMlnUNO7qfAWRKOXp6mu7NEXMtML1CliY3g6nEivx6PUpGDTAOjmUQPpDAZkmqDuiYczgu04a3x5GMvo1V0070AUIq33');

// registro do SW (proteção por domínio)
if (import.meta.env.PROD && window.location.hostname === 'snapgain.shop') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Router>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </Router>
  </>
);