import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, NavLink } from 'react-router-dom';

const PasswordStrengthIndicator = ({ password }) => {
    const tests = [
        { regex: /.{8,}/, message: '8+ characters' },
        { regex: /[a-z]/, message: 'Lowercase' },
        { regex: /[A-Z]/, message: 'Uppercase' },
        { regex: /[0-9]/, message: 'Number' },
        { regex: /[^A-Za-z0-9]/, message: 'Symbol' }
    ];

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tests.map((test, index) => (
                <div key={index} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${test.regex.test(password) ? 'bg-snapgain-green text-snapgain-purple' : 'bg-gray-200 text-gray-500'}`}>
                    {test.regex.test(password) ? <CheckCircle size={12} /> : null}
                    <span>{test.message}</span>
                </div>
            ))}
        </div>
    );
};


const PricingPage = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[a-z]/.test(pass)) return 'Password must contain a lowercase letter.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain an uppercase letter.';
    if (!/[0-9]/.test(pass)) return 'Password must contain a number.';
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Password must contain a symbol.';
    return '';
  };
  
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) {
        toast({ variant: "destructive", title: "Invalid Password", description: validationError });
        return;
    }
    if (password !== confirmPassword) {
        toast({ variant: "destructive", title: "Passwords do not match" });
        return;
    }

    setIsSubmitting(true);
    
    const { error } = await signUp(email, password, {
      data: {
        full_name: fullName
      }
    });

    if (error) {
        toast({ variant: "destructive", title: "Sign-up Failed", description: error.message });
        setIsSubmitting(false);
    } else {
        toast({
            title: '✅ Account Created!',
            description: 'Please proceed to payment to activate your account.',
            className: 'bg-snapgain-green text-snapgain-purple',
        });
        navigate('/payment');
    }
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-snapgain-purple">Create Your Premium Account</h1>
          <p className="text-snapgain-purple/80 mt-2">
            Already have an account? <NavLink to="/login" className="font-semibold text-snapgain-pink hover:underline">Log in</NavLink>
          </p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="full-name-signup" className="text-snapgain-purple">Full Name</Label>
              <Input id="full-name-signup" type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-signup" className="text-snapgain-purple">Email</Label>
            <Input id="email-signup" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="password-signup" className="text-snapgain-purple">Password</Label>
              <div className="relative">
                  <Input id="password-signup" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={handlePasswordChange} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
              </div>
              <PasswordStrengthIndicator password={password} />
          </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password-signup" className="text-snapgain-purple">Confirm Password</Label>
              <Input id="confirm-password-signup" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-snapgain-green text-snapgain-purple font-bold">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default PricingPage;