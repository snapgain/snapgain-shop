import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import AviosComparator from '@/components/AviosComparator';
import CashbackComparator from '@/components/CashbackComparator';
import NectarToAviosCalculator from '@/components/NectarToAviosCalculator';
import WelcomeMessage from '@/components/WelcomeMessage';
import RevolutVsAviosCalculator from '@/components/RevolutVsAviosCalculator';

const CalculatorPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Calculator Tools - SnapGain</title>
        <meta name="description" content="Use our advanced calculator tools to compare Avios, cashback, and maximize your rewards." />
      </Helmet>

      <motion.main
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        variants={containerVariants}
      >
        <WelcomeMessage />
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div variants={itemVariants}>
            <CashbackComparator />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AviosComparator />
          </motion.div>
          <motion.div variants={itemVariants}>
            <NectarToAviosCalculator />
          </motion.div>
          <motion.div variants={itemVariants}>
            <RevolutVsAviosCalculator />
          </motion.div>
        </div>
      </motion.main>
    </>
  );
};

export default CalculatorPage;