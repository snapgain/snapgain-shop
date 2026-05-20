// 2026-05-20 (v2): snapgain.shop is now a MARKETING LANDING for the
// main snapgain.uk Premium product. Calculator was migrated into the
// main app — this repo no longer hosts auth, /calculator, /library,
// or /account. Just a public landing + legal pages.
//
// Domain is paid until 2026-09-09 — see HANDOFF section 7.10.

import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OfflineDetector from '@/components/OfflineDetector';
import InstallPrompt from '@/components/InstallPrompt';
import { Toaster } from '@/components/ui/toaster';

// Pages — Marketing landing + legal only
import CalculatorLandingPage from '@/pages/CalculatorLandingPage';
import OfflinePage from '@/pages/OfflinePage';
import TermsPage from '@/pages/TermsPage';
import AboutPage from '@/pages/AboutPage';
import RefundPolicy from '@/pages/RefundPolicy';

// Pages — Disabled in this build (kept on disk; route table doesn't
// reach them). Re-enable by uncommenting both imports and routes.
// import EbookLandingPage from '@/pages/EbookLandingPage';
// import EbookLoginPage from '@/pages/EbookLoginPage';
// import LandingPage from '@/pages/LandingPage';
// import LibraryPage from '@/pages/LibraryPage';
// import ReaderHub from '@/pages/ReaderHub';
// import ChapterReader from '@/pages/ChapterReader';
// import EbookReader from '@/pages/EbookReader';
// import AccountPage from '@/pages/AccountPage';
// import CalculatorPage from '@/pages/CalculatorPage';
// import ThanksPage from '@/pages/ThanksPage';
// import AdminWatermarkLookup from '@/pages/AdminWatermarkLookup';

function App() {
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>SnapGain — Free Cashback & Avios Calculator</title>
        <meta
          name="description"
          content="Free UK cashback & Avios calculator. Compare strategies instantly. Then unlock SnapGain Premium for the full comparison engine."
        />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Header />
        <OfflineDetector />
        <InstallPrompt />

        <main className="flex-1 pb-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<CalculatorLandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/offline" element={<OfflinePage />} />

              {/* Catch-all → back to the landing. Anyone hitting an
                  old URL (library, calculator, login, etc.) gets
                  redirected gracefully to the marketing page. */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />

        <Toaster />
      </div>
    </>
  );
}

export default App;
