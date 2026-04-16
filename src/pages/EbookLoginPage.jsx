import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Mail,
  Loader2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const LOGO_URL =
  "https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png";

function isStrongPassword(pw) {
  if (!pw) return false;
  const min8 = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  return min8 && hasUpper && hasLower && hasNumber && hasSymbol;
}

export default function EbookLoginPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // set-password | reset-password | null
  const isSetPassword = mode === "set-password";
  const isResetPassword = mode === "reset-password";

  const title = useMemo(() => {
    if (isSetPassword) return "Create Password";
    if (isResetPassword) return "Reset Password";
    return "Log In";
  }, [isSetPassword, isResetPassword]);

  const subtitle = useMemo(() => {
    if (isSetPassword) return "Set a strong password to access your purchase.";
    if (isResetPassword) return "Choose a new password to access your library.";
    return "Sign in to access your e-book library.";
  }, [isSetPassword, isResetPassword]);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  // show/hide password
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // forgot password UI
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * ✅ Session bootstrap from email links (works for both set-password and reset-password)
   * Supports:
   * - PKCE: ?code=...
   * - Legacy hash: #access_token=...&refresh_token=...
   */
  useEffect(() => {
    const handleAuthFromEmailLink = async () => {
      if (!isSetPassword && !isResetPassword) return;

      try {
        const url = new URL(window.location.href);

        // 1) PKCE flow (?code=...)
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) console.log("PKCE exchange error:", error.message);
          return;
        }

        // 2) Hash/legacy flow (#access_token=...)
        if (window.location.hash) {
          const hash = new URLSearchParams(window.location.hash.substring(1));
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) console.log("Hash setSession error:", error.message);
          }
        }

        // 3) Fallback
        await supabase.auth.getSession();
      } catch (e) {
        console.log("email-link session bootstrap:", e);
      }
    };

    handleAuthFromEmailLink();
  }, [isSetPassword, isResetPassword]);

  // If user already logged in, go to library (except set/reset password flows)
  useEffect(() => {
    if (user && !isSetPassword && !isResetPassword) navigate("/library");
  }, [user, isSetPassword, isResetPassword, navigate]);

  const handleLoginWithPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });
      if (error) throw error;

      toast({ title: "Logged in ✅", description: "Welcome back!" });
      navigate("/library");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err?.message || "Check your email/password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetOrResetPassword = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(pw)) {
      toast({
        variant: "destructive",
        title: "Weak password",
        description:
          "At least 8 characters, with uppercase, lowercase, number and symbol.",
      });
      return;
    }
    if (pw !== pw2) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please confirm the same password.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        toast({
          variant: "destructive",
          title: "Session not found",
          description:
            "Please open the latest email link again (the one you just received).",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;

      toast({
        title: isResetPassword ? "Password reset ✅" : "Password set ✅",
        description: "Access unlocked!",
      });
      navigate("/library");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not update password",
        description: err?.message || "Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    try {
      // ✅ Supabase sends a recovery email
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,

      });
      if (error) throw error;

      toast({
        title: "Reset email sent ✅",
        description: "Check your inbox (and Spam/Promotions).",
      });

      setForgotOpen(false);
      setForgotEmail("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not send reset email",
        description: err?.message || "Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title} - SnapGain</title>
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <img
              src={LOGO_URL}
              alt="SnapGain Logo"
              className="h-20 w-auto mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {title}
            </h1>
            <p className="text-[var(--text-secondary)]">{subtitle}</p>
          </div>

          <div className="bg-[var(--bg-secondary)] p-8 rounded-[var(--radius-lg)] shadow-xl">
            {/* LOGIN */}
            {!isSetPassword && !isResetPassword ? (
              <>
                <form onSubmit={handleLoginWithPassword} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-[var(--text-primary)]">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-[var(--bg-primary)] border-[var(--color-purple)]/30 text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pw" className="text-[var(--text-primary)]">
                        Password
                      </Label>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotOpen((v) => !v);
                          setForgotEmail(email || "");
                        }}
                        className="text-sm font-semibold underline"
                        style={{ color: "var(--color-purple)" }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="pw"
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                        className="pl-10 pr-11 bg-[var(--bg-primary)] border-[var(--color-purple)]/30 text-[var(--text-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--color-purple)] hover:bg-[var(--color-purple)]/90 text-white font-semibold py-6 rounded-[var(--radius-md)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Log in
                      </>
                    )}
                  </Button>
                </form>

                {/* FORGOT PASSWORD PANEL */}
                {forgotOpen && (
                  <div className="mt-6 pt-6 border-t border-[var(--color-purple)]/20">
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Enter your email and we’ll send you a reset link.
                    </p>

                    <form onSubmit={handleSendResetEmail} className="space-y-3">
                      <div>
                        <Label className="text-[var(--text-primary)]">
                          Email for reset
                        </Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                            className="pl-10 bg-[var(--bg-primary)] border-[var(--color-purple)]/30 text-[var(--text-primary)]"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-purple)]/15 hover:bg-[var(--color-purple)]/20 text-[var(--text-primary)] font-semibold py-6 rounded-[var(--radius-md)]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-5 w-5" />
                            Send reset link
                          </>
                        )}
                      </Button>
                    </form>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotOpen(false);
                        setForgotEmail("");
                      }}
                      className="mt-3 w-full text-sm font-semibold underline"
                      style={{ color: "var(--color-purple)" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* SET or RESET PASSWORD */
              <form onSubmit={handleSetOrResetPassword} className="space-y-6">
                <div>
                  <Label htmlFor="newpw" className="text-[var(--text-primary)]">
                    New password
                  </Label>
                  <div className="relative mt-2">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="newpw"
                      type={showPw ? "text" : "password"}
                      placeholder="At least 8 chars + uppercase + lowercase + number + symbol"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      required
                      className="pl-10 pr-11 bg-[var(--bg-primary)] border-[var(--color-purple)]/30 text-[var(--text-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newpw2" className="text-[var(--text-primary)]">
                    Confirm password
                  </Label>
                  <div className="relative mt-2">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="newpw2"
                      type={showPw2 ? "text" : "password"}
                      placeholder="Repeat password"
                      value={pw2}
                      onChange={(e) => setPw2(e.target.value)}
                      required
                      className="pl-10 pr-11 bg-[var(--bg-primary)] border-[var(--color-purple)]/30 text-[var(--text-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw2((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                      aria-label={showPw2 ? "Hide password" : "Show password"}
                    >
                      {showPw2 ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-purple)] hover:bg-[var(--color-purple)]/90 text-white font-semibold py-6 rounded-[var(--radius-md)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      {isResetPassword ? "Reset password & continue" : "Set password & continue"}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            <Link to="/" className="underline">
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}