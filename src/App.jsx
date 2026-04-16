import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OfflineDetector from '@/components/OfflineDetector';
import InstallPrompt from '@/components/InstallPrompt';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Pages
import EbookLandingPage from '@/pages/EbookLandingPage';
import EbookLoginPage from '@/pages/EbookLoginPage';
import LandingPage from '@/pages/LandingPage';
import LibraryPage from '@/pages/LibraryPage';
import ReaderHub from '@/pages/ReaderHub';
import ChapterReader from '@/pages/ChapterReader';
import EbookReader from '@/pages/EbookReader'; // Newly added EbookReader
import AccountPage from '@/pages/AccountPage';
import OfflinePage from '@/pages/OfflinePage';
import TermsPage from '@/pages/TermsPage';
import AboutPage from '@/pages/AboutPage';
import RefundPolicy from '@/pages/RefundPolicy';
import ThanksPage from '@/pages/ThanksPage';
import AdminWatermarkLookup from '@/pages/AdminWatermarkLookup';
import CalculatorPage from '@/pages/CalculatorPage';

function App() {
  const location = useLocation();

  const isAppPage = ['/library', '/reader', '/ebook', '/account', '/admin', '/calculator'].some(path => location.pathname.startsWith(path));

  return (
    <>
      <Helmet>
        <title>SnapGain</title>
        <meta name="description" content="Your points companion" />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Header />
        <OfflineDetector />
        <InstallPrompt />

        <main className="flex-1 pb-10">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
              <Route path="/" element={<EbookLandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<EbookLoginPage />} />
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/thanks" element={<ThanksPage />} />
              
              <Route 
                path="/library" 
                element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reader/:productSlug" 
                element={
                  <ProtectedRoute>
                    <ReaderHub />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reader/:productSlug/:locale/:chapterNumber" 
                element={
                  <ProtectedRoute>
                    <ChapterReader />
                  </ProtectedRoute>
                } 
              />

              {/* Local HTML File Reader Route */}
              <Route 
                path="/ebook/:chapterNumber" 
                element={
                  <ProtectedRoute>
                    <EbookReader />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/calculator" 
                element={
                  <ProtectedRoute>
                    <CalculatorPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/watermark" 
                element={
                  <ProtectedRoute>
                    <AdminWatermarkLookup />
                  </ProtectedRoute>
                } 
              />
            </Routes>
           </AnimatePresence>
      </main>

        {!isAppPage && <Footer />}
        
        <Toaster />
      </div>
    </>
  );
}

export default App;