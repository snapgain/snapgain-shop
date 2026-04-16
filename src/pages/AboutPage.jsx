import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Wallet } from 'lucide-react';
const AboutPage = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };
  return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{
    duration: 0.5
  }} className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-snapgain-purple/20 shadow-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-snapgain-purple mb-4 tracking-tight">About SnapGain</h1>
            <p className="text-lg text-snapgain-purple/80 mb-8">
                Our mission is simple: to help you get the most out of your points and cashback programmes.
            </p>

            <div className="space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="p-4 bg-snapgain-green-light rounded-xl">
                        <Target className="w-12 h-12 text-snapgain-purple" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-snapgain-purple mb-2">What is SnapGain?</h2>
                        <p className="text-snapgain-purple/90">SnapGain is a suite of calculators, a digital wallet, and educational resources designed for points and miles enthusiasts in the UK. This includes our digital eBook, The Complete Guide for Immigrants in the UK, which offers practical guidance on utilising cashback platforms, loyalty schemes, and airline miles effectively while living in the UK.

We know how confusing it can be to navigate different conversion rates, reward systems, and loyalty programmes—especially as an immigrant. SnapGain simplifies this process by offering clear, reliable tools and structured educational content, empowering you to make informed decisions and maximise the value of every point and every pound you spend.</p>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                     <div className="p-4 bg-snapgain-green-light rounded-xl">
                        <TrendingUp className="w-12 h-12 text-snapgain-purple" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-snapgain-purple mb-2">How Does It Work?</h2>
                        <p className="text-snapgain-purple/90">
                            Our comparators use the latest conversion rates to show you which programme offers the best return for your points. For example, you can compare whether it's better to convert your RevPoints to Avios or opt for cashback. The calculators are straightforward: enter the values and instantly see which option is best.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="p-4 bg-snapgain-green-light rounded-xl">
                        <Wallet className="w-12 h-12 text-snapgain-purple" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-snapgain-purple mb-2">The Premium Wallet</h2>
                        <p className="text-snapgain-purple/90">
                            With our premium subscription, you unlock the SnapGain Wallet. Here, you can manually log all your Avios and cashback earnings from different platforms (like TopCashback, Quidco, etc.). The wallet consolidates everything, showing you your totals and the monetary value of your Avios, giving you a complete and organised view of your rewards portfolio.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>;
};
export default AboutPage;