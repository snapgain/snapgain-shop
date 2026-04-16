import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      
      // Check if user dismissed recently
      const dismissedAt = localStorage.getItem('pwa-install-dismissed');
      if (dismissedAt) {
        const daysSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 7) {
          return;
        }
      }
      
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-[var(--radius-lg)] shadow-2xl border border-[var(--color-purple)]/20 p-4">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-pink)] p-2 rounded-lg">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] mb-1">Install SnapGain</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Access your e-books offline and get a better reading experience
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleInstall}
              className="w-full bg-[var(--color-purple)] hover:bg-[var(--color-purple)]/90 text-white"
            >
              Install App
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;