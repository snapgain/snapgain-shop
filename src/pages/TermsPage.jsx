import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 },
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-snapgain-purple/20 shadow-xl prose prose-lg prose-p:text-snapgain-purple/90 prose-h1:text-snapgain-purple prose-h2:text-snapgain-purple prose-strong:text-snapgain-purple"
        >
            <h1>Terms and Conditions</h1>
            <p className="lead">Last updated: 8 November 2025</p>

            <p>
                Welcome to SnapGain! These terms and conditions outline the rules and regulations for the use of our website and services, located at snapgain.shop. By accessing this website, we assume you accept these terms and conditions in full.
            </p>

            <h2>Premium Subscription</h2>
            <p>
                <strong>Services:</strong> The SnapGain subscription grants access to premium features, including but not limited to, the "Points & Cashback Wallet" and advanced calculators.
            </p>
            <p>
                <strong>Payment:</strong> Subscriptions are billed on a monthly basis at the price displayed on the subscription page. Payment is processed through our partner, Stripe.
            </p>

            <h2>Cancellation Policy</h2>
            <p>
                You may cancel your subscription at any time. Cancellation can be managed through your account settings or by contacting support.
            </p>
            <p>
                Once the subscription is cancelled, you will continue to have access to premium features until the end of your current billing cycle. After the billing cycle ends, your account will revert to the free plan (if applicable) or access to premium features will be revoked. <strong>No pro-rata refunds will be issued for partial subscription periods.</strong>
            </p>

            <h2>Use of the Tool</h2>
            <p>
                The calculators and information provided by SnapGain are for informational purposes only. While we strive to keep conversion rates and data up-to-date, we do not guarantee absolute accuracy. Rates can change without notice. Always verify the rates on the official loyalty programme websites before making any financial decisions.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
                SnapGain will not be held liable for any losses or damages arising from the use of our tools or information. Use of the platform is at your own risk.
            </p>

            <h2>Jurisdiction</h2>
            <p>
                These terms will be governed by and construed in accordance with the laws of the United Kingdom, and you submit to the non-exclusive jurisdiction of the courts located in the United Kingdom for the resolution of any disputes.
            </p>

            <h2>Contact</h2>
            <p>
                If you have any questions about these Terms, please contact us at: <strong>support@snapgain.uk</strong>.
            </p>
        </motion.div>
    );
};

export default TermsPage;