import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const HomePage = () => {
    const { user, loading, hasActiveSubscription } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && user && hasActiveSubscription) {
            navigate('/comparator');
        }
    }, [user, loading, hasActiveSubscription, navigate]);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
          },
        },
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          },
        },
      };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-5xl md:text-7xl font-extrabold text-snapgain-purple mb-4 tracking-tighter leading-tight">
                    Maximise Your <span className="bg-gradient-to-r from-snapgain-pink to-snapgain-purple bg-clip-text text-transparent">Avios & Cashback</span>
                </h1>
                <p className="text-xl md:text-2xl text-snapgain-purple/80 max-w-3xl mx-auto mb-10">
                    The ultimate tool to compare strategies, manage your points, and optimise your earnings. Stop guessing, start maximising.
                </p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Link to="/pricing">
                    <Button size="lg" className="bg-snapgain-pink text-white font-bold text-lg shadow-xl shadow-snapgain-pink/40 hover:bg-snapgain-pink/80 transform hover:scale-110 transition-all duration-300">
                        Unlock Premium Access Now
                    </Button>
                </Link>
                <p className="text-sm text-snapgain-purple/60 mt-3">Single plan. Cancel anytime.</p>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-snapgain-purple/20 text-left">
                    <CheckCircle className="w-8 h-8 text-snapgain-green mb-3" />
                    <h3 className="text-xl font-bold text-snapgain-purple mb-2">Smart Comparators</h3>
                    <p className="text-snapgain-purple/80">Compare conversion rates between RevPoints, Nectar, and Avios to always make the best decision.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-snapgain-purple/20 text-left">
                    <CheckCircle className="w-8 h-8 text-snapgain-green mb-3" />
                    <h3 className="text-xl font-bold text-snapgain-purple mb-2">Centralised Wallet</h3>
                    <p className="text-snapgain-purple/80">Manage all your Avios and cashback earnings from different platforms in one single place.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-snapgain-purple/20 text-left">
                    <CheckCircle className="w-8 h-8 text-snapgain-green mb-3" />
                    <h3 className="text-xl font-bold text-snapgain-purple mb-2">Simplified Calculations</h3>
                    <p className="text-snapgain-purple/80">Our tools do the complex calculations for you, showing you the real value of your points.</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HomePage;