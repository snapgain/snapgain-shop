import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Mail,
  LogIn,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const LOGO_URL =
  "https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png";

const SUPABASE_FUNCTIONS_BASE =
  "https://auhtwkvwbgvekvwctcaj.supabase.co/functions/v1";

const DEFAULT_PRODUCT_SLUG = "from-cashback-to-flights";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default function ThanksPage() {
  const [params] = useSearchParams();

  const status = params.get("checkout"); // success | cancel | null
  const isSuccess = status === "success";
  const isCancel = status === "cancel";

  // Optional: capture email from URL if you pass it
  const urlEmail =
    params.get("email") || params.get("customer_email") || "";

  // Optional: if you ever pass productSlug in URL
  const productSlug = params.get("product") || DEFAULT_PRODUCT_SLUG;

  const [email, setEmail] = useState(urlEmail);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState(""); // success/error UI message

  const title = useMemo(() => {
    if (isSuccess) return "Payment confirmed";
    if (isCancel) return "Payment cancelled";
    return "Thanks";
  }, [isSuccess, isCancel]);

  const description = useMemo(() => {
    if (isSuccess)
      return "Your payment was successful. Now check your email to create a password and access your library.";
    if (isCancel)
      return "No worries — your payment was cancelled. You can try again whenever you’re ready.";
    return "Thank you!";
  }, [isSuccess, isCancel]);

  const openEmail = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "mailto:";
    } else {
      window.open("https://mail.google.com", "_blank", "noopener,noreferrer");
    }
  };

  const resendAccessEmail = async () => {
    setResendMessage("");

    const cleanEmail = String(email || "").trim();
    if (!isValidEmail(cleanEmail)) {
      setResendMessage("Please enter a valid email address.");
      return;
    }

    setResendLoading(true);
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_BASE}/resend-access-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          productSlug,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setResendMessage(data?.error || "Failed to resend. Please try again.");
        return;
      }

      setResendMessage(
        "Sent ✅ Please check Inbox, Spam and Promotions. Mark it as “Not spam” if needed."
      );
    } catch (err) {
      setResendMessage("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title} - SnapGain</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        {/* Soft glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 0%, rgba(125,77,251,0.18), transparent 60%), radial-gradient(40% 30% at 80% 20%, rgba(255,63,206,0.12), transparent 60%), radial-gradient(40% 30% at 15% 35%, rgba(153,255,51,0.10), transparent 60%)",
          }}
        />

        <div className="relative z-10 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-xl"
          >
            <div
              className="rounded-[var(--radius-xl)] shadow-xl p-7 sm:p-10 text-center"
              style={{
                background: "rgba(255,255,255,0.60)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(125,77,251,0.18)",
              }}
            >
              <img
                src={LOGO_URL}
                alt="SnapGain"
                className="h-16 sm:h-20 w-auto mx-auto mb-5"
              />

              {isSuccess ? (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle
                    className="h-7 w-7"
                    style={{ color: "var(--color-neon-green)" }}
                  />
                  <h1
                    className="text-2xl sm:text-3xl font-extrabold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Payment confirmed ✅
                  </h1>
                </div>
              ) : isCancel ? (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles
                    className="h-7 w-7"
                    style={{ color: "var(--color-pink)" }}
                  />
                  <h1
                    className="text-2xl sm:text-3xl font-extrabold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Payment cancelled
                  </h1>
                </div>
              ) : (
                <h1
                  className="text-2xl sm:text-3xl font-extrabold mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Thanks!
                </h1>
              )}

              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                {description}
              </p>

              {isSuccess && (
                <>
                  {/* NEXT STEPS */}
                  <div
                    className="mt-6 text-left rounded-[var(--radius-lg)] p-5"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(125,77,251,0.16)",
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Next step:
                    </p>
                    <ul
                      className="mt-2 text-sm space-y-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <li>1) Check your email inbox (and Spam/Promotions)</li>
                      <li>
                        2) Open the message from <strong>SnapGain</strong>
                      </li>
                      <li>
                        3) Click <strong>Set password & access</strong>
                      </li>
                      <li>4) Create your password and access your Library</li>
                    </ul>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        onClick={openEmail}
                        className="w-full text-white font-extrabold py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
                        style={{ backgroundImage: "var(--gradient-header)" }}
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Open email
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="w-full font-extrabold py-6 rounded-[var(--radius-lg)]"
                        style={{
                          borderColor: "rgba(125,77,251,0.35)",
                          color: "var(--text-primary)",
                          backgroundColor: "rgba(255,255,255,0.45)",
                        }}
                      >
                        <Link to="/login">
                          <LogIn className="mr-2 h-5 w-5" />
                          Log in
                        </Link>
                      </Button>
                    </div>

                    <p
                      className="mt-3 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Tip: if it landed in spam, mark as “Not spam” so future
                      customers get it in Inbox.
                    </p>
                  </div>

                  {/* RESEND ACCESS EMAIL */}
                  <div
                    className="mt-4 text-left rounded-[var(--radius-lg)] p-5"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(125,77,251,0.16)",
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Didn’t receive the email?
                    </p>

                    <div className="mt-3 space-y-2">
                      <Label
                        htmlFor="resend_email"
                        className="text-[var(--text-primary)]"
                      >
                        Confirm your email used at checkout
                      </Label>
                      <Input
                        id="resend_email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[var(--bg-primary)] border-[var(--color-purple)]/30 text-[var(--text-primary)]"
                      />
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        onClick={resendAccessEmail}
                        disabled={resendLoading}
                        className="w-full text-white font-extrabold py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
                        style={{ backgroundImage: "var(--gradient-header2)" }}
                      >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        {resendLoading ? "Resending..." : "Resend access email"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full font-extrabold py-6 rounded-[var(--radius-lg)]"
                        style={{
                          borderColor: "rgba(125,77,251,0.25)",
                          color: "var(--text-primary)",
                          backgroundColor: "rgba(255,255,255,0.35)",
                        }}
                        onClick={() => {
                          // quick help to open Gmail + tell user where to look
                          openEmail();
                        }}
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Open Gmail
                      </Button>
                    </div>

                    {resendMessage ? (
                      <p
                        className="mt-3 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {resendMessage}
                      </p>
                    ) : null}
                  </div>
                </>
              )}

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="font-extrabold py-6 rounded-[var(--radius-lg)]"
                  style={{
                    borderColor: "rgba(125,77,251,0.25)",
                    color: "var(--text-primary)",
                    backgroundColor: "rgba(255,255,255,0.35)",
                  }}
                >
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to home
                  </Link>
                </Button>

                <Button
                  asChild
                  className="text-white font-extrabold py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
                  style={{ backgroundImage: "var(--gradient-header2)" }}
                >
                  <Link to="/library">Go to Library</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}