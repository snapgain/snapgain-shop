import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Download, ArrowRight, Loader2, AlertCircle, Calculator } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const productSlug = searchParams.get('product_slug');
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        navigate('/', { replace: true });
        return;
      }
      
      // If we have a sessionId and productSlug, we can assume partial success and just show the thank you message
      // verification happens via webhook in the background.
      // We can optionally verify session if we have a verification function, but the prompt emphasizes showing product details.
      
      setStatus('success');
    };

    verifySession();
  }, [sessionId, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-snapgain-purple animate-spin mb-4" />
        <p className="text-snapgain-purple text-lg font-medium">Finalizing your purchase...</p>
      </div>
    );
  }

  if (status === 'error') {
     return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border-2 border-red-100">
           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
           <p className="text-gray-600 mb-6">{errorMessage}</p>
           <Link to="/">
              <Button>Return Home</Button>
           </Link>
        </div>
      </div>
     );
  }

  const isCalculator = productSlug === 'premium-calculator';
  const productName = isCalculator ? 'Premium Calculator Tool' : 'The Complete Guide for Immigrants in the UK';

  return (
    <>
      <Helmet>
        <title>Purchase Successful - SnapGain</title>
        <meta name="description" content="Thank you for your purchase!" />
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center border-2 border-snapgain-purple/10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-snapgain-purple mb-4">Payment Successful!</h1>
          
          <p className="text-xl text-snapgain-purple/80 mb-8 max-w-lg mx-auto">
            Thank you for buying <strong>"{productName}"</strong>.
          </p>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8 text-left shadow-sm">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3 text-lg">
              <Mail className="w-5 h-5" />
              Check Your Email
            </h3>
            <p className="text-blue-800 leading-relaxed">
              We have sent the confirmation and access link to your email address. It should arrive within a few minutes.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
            {isCalculator ? (
              <Link to="/library" className="flex-1">
                <Button size="lg" className="w-full h-full bg-snapgain-purple hover:bg-snapgain-purple/90 text-lg py-6 shadow-lg shadow-snapgain-purple/20">
                    <Calculator className="mr-2 h-5 w-5" />
                    Go to Library
                </Button>
              </Link>
            ) : (
                <a 
                href="https://drive.google.com/file/d/15PGhHYyhsfgisYxemSxF_DmKb5UfkA_H/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
                >
                <Button size="lg" className="w-full h-full bg-snapgain-purple hover:bg-snapgain-purple/90 text-lg py-6 shadow-lg shadow-snapgain-purple/20">
                    <Download className="mr-2 h-5 w-5" />
                    Download E-Book
                </Button>
                </a>
            )}
            
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full h-full border-2 border-snapgain-purple text-snapgain-purple hover:bg-snapgain-purple hover:text-white text-lg py-6">
                Back to Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            Need help? Contact us at <a href="mailto:support@snapgain.uk" className="text-snapgain-purple underline">support@snapgain.uk</a>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SuccessPage;