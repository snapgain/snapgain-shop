import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasActiveSubscription = useMemo(() => {
    const status = profile?.subscription_status;
    return status === 'active' || status === 'trialing';
  }, [profile]);
  
  const fetchProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      return null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id);

    if (error && error.code !== 'PGRST116') { // PGRST116: "Cannot coerce to single" - means 0 rows
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
    }
    
    const userProfile = data?.[0] || null;
    setProfile(userProfile);
    return userProfile;
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if(currentUser) {
        await fetchProfile(currentUser);
    } else {
        setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
        if (event === 'SIGNED_OUT') {
           navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, navigate]);
  
  useEffect(() => {
      if (!user) return;
      
      const profileListener = supabase
        .channel(`public:profiles:id=eq.${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
          (payload) => {
            setProfile(payload.new);
          }
        )
        .subscribe();
      
      return () => {
          supabase.removeChannel(profileListener);
      };

  }, [user]);


  const signUp = useCallback(async (email, password, options) => {
    return await supabase.auth.signUp({
      email,
      password,
      options,
    });
  }, []);

  const signIn = useCallback(async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. If the error persists, please clear your browser cookies.",
      });
    } else {
      toast({
          title: '👋 See you soon!',
          description: 'You have been signed out.',
      });
    }
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    hasActiveSubscription,
    signUp,
    signIn,
    signOut,
  }), [user, session, profile, loading, hasActiveSubscription, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};