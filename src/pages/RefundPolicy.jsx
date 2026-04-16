import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - SnapGain</title>
        <meta name="description" content="Refund Policy for SnapGain digital products and services." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto py-12 px-4"
      >
        <h1 className="text-4xl font-bold text-snapgain-purple mb-8">Refund Policy</h1>
        
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-snapgain-purple/20 space-y-6 text-snapgain-purple/80">
          <section>
            <h2 className="text-2xl font-semibold text-snapgain-purple mb-4">Digital Products (E-books & Guides)</h2>
            <p className="mb-4">
              Due to the nature of digital downloads, we generally do not offer refunds on e-books, guides, or other downloadable content once they have been purchased and the download link has been accessed. This is because digital content cannot be "returned" in the same way as physical goods.
            </p>
            <p>
              However, we want you to be completely satisfied with your purchase. If you have trouble downloading the file or if the file is defective, please contact our support team immediately, and we will resolve the issue.
            </p>
            <p className="mt-4">
              <strong>Exceptions:</strong> If you have not yet downloaded the product, you may be eligible for a refund within 14 days of purchase, in accordance with UK consumer protection laws for digital content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-snapgain-purple mb-4">Subscription Services</h2>
            <p className="mb-4">
              For our subscription-based tools (Calculator, Comparator, Wallet), you may cancel your subscription at any time.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Cancellations:</strong> If you cancel your subscription, you will continue to have access to the service until the end of your current billing period. No further charges will be applied.</li>
              <li><strong>Refunds:</strong> We generally do not provide refunds for partial subscription periods. However, if you believe you were charged in error or have a special circumstance, please reach out to our support team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-snapgain-purple mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Refund Policy or need to request a refund, please contact us at:
            </p>
            <p className="font-semibold mt-2">
              <a href="mailto:support@snapgain.uk" className="text-snapgain-pink hover:underline">support@snapgain.uk</a>
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default RefundPolicy;