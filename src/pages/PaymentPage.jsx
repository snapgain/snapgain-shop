import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const PaymentPage = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
            body: { 
                product_slug: 'premium-calculator'
            },
        });

        if (error) throw error;
        
        if (data?.url) {
            window.location.href = data.url;
        } else {
            throw new Error('No checkout URL returned');
        }

    } catch (error) {
        console.error('Payment error:', error);
        toast({ 
          variant: 'destructive', 
          title: 'Checkout Failed', 
          description: error.message || 'Could not start checkout. Please try again.' 
        });
        setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 pt-20"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Unlock Premium
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Get lifetime access to our advanced calculator tools.
        </p>
      </div>

      <div className="flex justify-center">
        <motion.div 
          layout
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl w-full max-w-md transform transition-all duration-500"
        >
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Premium Calculator</h2>
            <div className="my-6">
              <span className="text-5xl font-extrabold text-slate-900">£19.99</span>
              <span className="text-lg font-medium text-slate-500"> / one-time</span>
            </div>
            <p className="text-slate-600 mb-6">Compare conversion rates, ROI, and more.</p>
            
            <ul className="text-left space-y-3 mb-8 text-sm text-slate-600">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Avios vs RevPoints Comparator</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cashback ROI Calculator</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Multi-Platform Dashboard</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting || loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-base py-6 rounded-xl shadow-lg shadow-purple-200 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now
                </>
              )}
            </Button>
            <p className="text-xs text-center text-slate-400">
              Secure payment powered by Stripe
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;