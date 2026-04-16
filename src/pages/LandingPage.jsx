import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Calculator, Globe, CreditCard, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const LandingPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [hasPurchasedEbook, setHasPurchasedEbook] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const ebookStripeLink = "https://buy.stripe.com/7sY14h0t02f7fDj5lhafS00";

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user) {
        setHasPurchasedEbook(false);
        return;
      }

      try {
        setCheckingPurchase(true);
        const { data: product } = await supabase
          .from('products')
          .select('id')
          .eq('slug', 'from-cashback-to-flights')
          .single();

        if (product) {
          const { data: purchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product.id)
            .eq('status', 'paid')
            .maybeSingle();

          setHasPurchasedEbook(!!purchase);
        }
      } catch (error) {
        console.error('Error checking purchase:', error);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleCalculatorCheckout = async () => {
    setIsProcessingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { product_slug: "premium-calculator" }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: err.message || "Failed to initiate checkout. Please try again."
      });
      setIsProcessingCheckout(false);
    }
  };

  const renderPrimaryCTA = () => {
    if (checkingPurchase) {
      return (
        <Button size="lg" disabled className="bg-snapgain-pink text-white font-bold text-xl px-12 py-6">
          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
          Checking access...
        </Button>
      );
    }

    if (hasPurchasedEbook) {
      return (
        <Link to="/library">
          <Button size="lg" className="bg-snapgain-green text-snapgain-purple font-bold text-xl px-12 py-6 shadow-2xl shadow-snapgain-green/50 hover:bg-snapgain-green/80 transform hover:scale-110 transition-all duration-300">
            <BookOpen className="mr-3 h-6 w-6" />
            Continue Reading
          </Button>
        </Link>
      );
    }

    return (
      <a href={ebookStripeLink} target="_blank" rel="noopener noreferrer">
        <Button size="lg" className="bg-snapgain-pink text-white font-bold text-xl px-12 py-6 shadow-2xl shadow-snapgain-pink/50 hover:bg-snapgain-pink/80 transform hover:scale-110 transition-all duration-300">
          <CreditCard className="mr-3 h-6 w-6" />
          Get the Complete Guide – £49.97
        </Button>
      </a>
    );
  };

  const renderLoginCTA = () => {
     if (checkingPurchase) return null;

     if (!user) {
       return (
        <Link to="/login">
          <Button variant="outline" size="lg" className="mt-4 border-2 border-snapgain-purple text-snapgain-purple hover:bg-snapgain-purple hover:text-white font-bold text-lg px-8 py-4 transition-all duration-300">
            Log in to Read
          </Button>
        </Link>
       );
     }
     return null;
  };

  return <>
      <Helmet>
        <title>SnapGain - Turn Everyday Spending Into Airline Tickets</title>
        <meta name="description" content="The complete guide for immigrants in the UK to turn everyday spending into airline tickets with up to 100% discount. Start traveling more today." />
      </Helmet>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center pt-10 pb-20">
        <motion.div variants={itemVariants} className="mb-16 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-snapgain-purple mb-6 tracking-tighter leading-tight">
            Turn Everyday Spending Into <span className="bg-gradient-to-r from-snapgain-pink to-snapgain-purple bg-clip-text text-transparent">Airline Tickets</span>
          </h1>
          <p className="text-xl md:text-2xl text-snapgain-purple/80 max-w-3xl mx-auto mb-4">The ultimate guide for immigrants in the UK who want to travel more without breaking the bank.</p>
          <p className="text-lg md:text-xl text-snapgain-purple/70 max-w-2xl mx-auto">Learn how to turn everyday spending into flights with up to 100% savings by mastering cashback and airline miles.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-20 max-w-4xl mx-auto px-4">
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-snapgain-purple/20">
            <Globe className="w-12 h-12 text-snapgain-purple mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-snapgain-purple mb-4">Our Mission</h2>
            <p className="text-lg text-snapgain-purple/80 leading-relaxed">We believe that staying connected to your home country should never be a luxury. SnapGain was created to help immigrants in the UK recover part of the money they already spend, using smart cashback strategies, loyalty points, and airline miles.</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-20 px-4">
          <div className="bg-gradient-to-br from-snapgain-pink/20 to-snapgain-purple/20 backdrop-blur-sm p-10 rounded-3xl border-2 border-snapgain-purple/30 max-w-5xl mx-auto">
            <BookOpen className="w-16 h-16 text-snapgain-purple mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-snapgain-purple mb-6">
              The Complete Guide for Immigrants in the UK
            </h2>
            <p className="text-2xl font-bold text-snapgain-pink mb-4">
              Turn Everyday Spending Into Airline Tickets with Up to 100% Discount
            </p>
            <p className="text-lg text-snapgain-purple/80 max-w-3xl mx-auto mb-8 leading-relaxed">This comprehensive eBook reveals the exact strategies, tools, and insider techniques to maximise your points and cashback.</p>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Maximise credit card rewards safely and responsibly</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Avoid common mistakes that cost immigrants thousands</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Recover money from everyday spending using smart strategies</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Learn how to travel without paying for accommodation</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-snapgain-purple/20 max-w-md mx-auto mb-8">
              <p className="text-sm text-snapgain-purple/70 line-through mb-2">Regular Price: £79.97</p>
              <p className="text-4xl font-extrabold text-snapgain-purple mb-1">£49.97</p>
              <p className="text-sm text-snapgain-green font-semibold">Limited Time Offer - Save £30!</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              {renderPrimaryCTA()}
              <p className="text-sm text-snapgain-purple/60 mt-4">Instant digital download. Start reading in minutes.</p>
              {renderLoginCTA()}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-20 px-4">
          <div className="bg-white/50 backdrop-blur-sm p-10 rounded-3xl border-2 border-snapgain-purple/30 max-w-4xl mx-auto">
            <Calculator className="w-16 h-16 text-snapgain-purple mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-snapgain-purple mb-4">
              Premium Calculator Tool 
            </h2>
            <p className="text-lg text-snapgain-purple/80 max-w-2xl mx-auto mb-6 leading-relaxed">
              We're building a powerful suite of calculators to help you compare conversion rates, optimize your earnings, and make data-driven decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Avios vs RevPoints Comparator</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Cashback ROI Calculator</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Nectar to Avios Converter</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-snapgain-green flex-shrink-0 mt-1" />
                <p className="text-snapgain-purple">Multi-Platform Wallet Dashboard</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleCalculatorCheckout}
                disabled={isProcessingCheckout}
                className="border-2 border-snapgain-purple text-snapgain-purple hover:bg-snapgain-purple hover:text-white font-bold px-8 py-6 text-xl transition-all hover:scale-105"
              >
                {isProcessingCheckout ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get Premium Calculator
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-r from-snapgain-pink to-snapgain-purple p-1 rounded-3xl">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-snapgain-purple mb-4">
                Start Your Journey to Smarter Travel Today
              </h2>
              <p className="text-lg text-snapgain-purple/80 mb-6">
                Join hundreds of immigrants who are already flying home more often for less.
              </p>
              {renderPrimaryCTA()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>;
};
export default LandingPage;