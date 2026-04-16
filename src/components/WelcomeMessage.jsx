import React from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = () => {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-snapgain-purple tracking-tighter">
        Smart Calculators
      </h1>
      <p className="text-lg md:text-xl text-snapgain-purple/80 mt-2 max-w-2xl mx-auto">
        Discover the best strategy to maximise your Avios on every purchase.
      </p>
    </motion.div>
  );
};

export default WelcomeMessage;