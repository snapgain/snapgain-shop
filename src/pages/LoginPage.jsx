import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import SnapGainLogo from '@/components/SnapGainLogo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, hasActiveSubscription, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
        if(hasActiveSubscription) {
            navigate('/comparator');
        } else {
            navigate('/pricing');
        }
    }
  }, [user, hasActiveSubscription, loading, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await signIn(email, password);

    if (error) {
       toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: error.message,
      });
    } else {
      toast({
          title: '🎉 Welcome back!',
          description: 'You have successfully logged in.',
          className: 'bg-snapgain-green text-snapgain-purple',
      });
      // Navigation is handled by useEffect
    }
    setIsSubmitting(false);
  };
  
  const handleNotImplemented = () => {
    toast({
      title: '🚧 Under construction!',
      description: "This feature isn't implemented yet, but feel free to request it in the next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center"
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-snapgain-purple/20 shadow-xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <SnapGainLogo />
          <p className="text-snapgain-purple/80 mt-4">Log in to access your premium features.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-snapgain-purple font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-snapgain-purple/50" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-snapgain-purple font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-snapgain-purple/50" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-snapgain-purple text-white font-bold text-base py-3 rounded-xl shadow-lg shadow-snapgain-purple/40 hover:bg-snapgain-purple/80 transform hover:scale-105 transition-all duration-300"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In'}
          </Button>
        </form>
        <div className="mt-6 text-center text-snapgain-purple/70">
          <p>Don't have an account?{' '}
            <NavLink to="/pricing" className="font-semibold text-snapgain-pink hover:underline">
              Subscribe now!
            </NavLink>
          </p>
          <p className="text-sm mt-4">
            <button onClick={handleNotImplemented} className="hover:underline">Forgot your password?</button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;