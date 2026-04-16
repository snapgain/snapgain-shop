import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const AccountPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>My Account - SnapGain</title>
        <meta name="description" content="Manage your SnapGain account" />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              My Account
            </h1>
            <p className="text-[var(--text-secondary)]">
              Manage your account settings
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-lg p-8"
          >
            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--color-purple)]" />
                  Profile Information
                </h2>
                <div className="bg-[var(--bg-primary)] rounded-[var(--radius-md)] p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[var(--text-secondary)]" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Email Address</p>
                      <p className="text-[var(--text-primary)] font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-[var(--color-purple)]/20">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;