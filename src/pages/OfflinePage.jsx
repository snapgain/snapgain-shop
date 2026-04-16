import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfflinePage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (navigator.onLine) {
      navigate(-1);
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Helmet>
        <title>Offline - SnapGain</title>
        <meta name="description" content="You're currently offline" />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-[var(--bg-secondary)] p-8 rounded-[var(--radius-lg)] shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-pink)] rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              You're Offline
            </h1>

            <p className="text-[var(--text-secondary)] mb-6">
              Please check your internet connection to continue reading. Some content may be available offline if you've previously accessed it.
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-[var(--color-purple)] hover:bg-[var(--color-purple)]/90 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Connection
              </Button>

              <Button
                onClick={() => navigate('/library')}
                variant="outline"
                className="w-full"
              >
                Go to Library
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OfflinePage;