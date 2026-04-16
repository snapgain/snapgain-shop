import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Calculator, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const PRODUCT_SLUG = "from-cashback-to-flights";
const PRICE_LABEL = "£49.97";

const PREMIUM_SLUG = "premium-calculator"; // ✅ separate product
const PREMIUM_LABEL = "Premium Calculator"; // ✅ copy only (no price here yet)

const SUPABASE_FUNCTIONS_BASE =
  "https://auhtwkvwbgvekvwctcaj.supabase.co/functions/v1";

const EbookLandingPage = () => {
  const { user } = useAuth();

  const [checking, setChecking] = useState(true);
  const [hasEbook, setHasEbook] = useState(false);

  // ✅ Stable, Horizons-friendly function
  const startCheckout = useCallback(async (productSlug) => {
  try {
    const res = await fetch(
      `${SUPABASE_FUNCTIONS_BASE}/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Checkout error:", data);
      alert(data?.error || "Checkout failed. Please try again.");
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
      return;
    }

    alert("Checkout created but missing redirect URL (url).");
  } catch (err) {
    console.error("startCheckout crash:", err);
    alert("Checkout failed due to an unexpected error. Check console.");
  }
}, []);



  useEffect(() => {
    let cancelled = false;

    const checkPurchase = async () => {
      if (!user) {
        setHasEbook(false);
        setChecking(false);
        return;
      }

      try {
        setChecking(true);

        const { data: product, error: pErr } = await supabase
          .from("products")
          .select("id, slug")
          .eq("slug", PRODUCT_SLUG)
          .single();

        if (pErr || !product?.id) throw pErr || new Error("Product not found");

        const { data: purchase, error: buyErr } = await supabase
          .from("purchases")
          .select("id, status")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .eq("status", "paid")
          .maybeSingle();

        if (buyErr) throw buyErr;

        if (!cancelled) setHasEbook(!!purchase?.id);
      } catch (e) {
        console.error("Error checking purchase:", e);
        if (!cancelled) setHasEbook(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    checkPurchase();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // ✅ CTA block (no useMemo needed)
  const ctaBlock = (() => {
    // Not logged in
    if (!user) {
      return (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="button"
            size="lg"
            className="text-white font-extrabold px-10 py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
            style={{ backgroundImage: "var(--gradient-header2)" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startCheckout(PRODUCT_SLUG);
            }}
          >
            Get the Complete Guide – {PRICE_LABEL}
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="font-extrabold px-8 py-6 rounded-[var(--radius-lg)]"
            style={{
              borderColor: "rgba(125,77,251,0.35)",
              color: "var(--text-primary)",
              backgroundColor: "rgba(255,255,255,0.45)",
            }}
          >
            <Link to="/login">
              <BookOpen className="mr-2 h-6 w-6" />
              Log in to Read
            </Link>
          </Button>
        </div>
      );
    }

    // Logged in, still checking
    if (checking) {
      return (
        <div className="mt-8 flex justify-center">
          <div
            className="px-5 py-3 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(125,77,251,0.18)",
              color: "var(--color-purple)",
            }}
          >
            Checking your access...
          </div>
        </div>
      );
    }

    // Logged in, not purchased
    if (!hasEbook) {
      return (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <div
            className="px-5 py-3 rounded-[var(--radius-lg)] text-sm font-semibold flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(125,77,251,0.18)",
              color: "var(--color-purple)",
            }}
          >
            <Lock className="h-4 w-4 mr-2" />
            Purchase required
          </div>

          <Button
            type="button"
            size="lg"
            className="text-white font-extrabold px-10 py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
            style={{ backgroundImage: "var(--gradient-header)" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startCheckout(PRODUCT_SLUG);
            }}
          >
            Buy Access – {PRICE_LABEL}
          </Button>
        </div>
      );
    }

    // Logged in, purchased
    return (
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          size="lg"
          className="text-white font-extrabold px-8 py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
          style={{ backgroundImage: "var(--gradient-header)" }}
        >
          <Link to="/library">Continue Reading</Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="font-extrabold px-8 py-6 rounded-[var(--radius-lg)]"
          style={{
            borderColor: "rgba(125,77,251,0.35)",
            color: "var(--text-primary)",
            backgroundColor: "rgba(255,255,255,0.45)",
          }}
        >
          <Link to="/library">Go to My Library</Link>
        </Button>
      </div>
    );
  })();

  return (
    <>
      <Helmet>
        <title>SnapGain | Turn Everyday Spending Into Airline Tickets</title>
        <meta
          name="description"
          content="Turn everyday spending into airline tickets. Read your SnapGain eBook securely inside your member area — no downloads."
        />
      </Helmet>

      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Soft glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 40% at 50% 0%, rgba(125,77,251,0.18), transparent 60%), radial-gradient(40% 30% at 80% 20%, rgba(255,63,206,0.12), transparent 60%), radial-gradient(40% 30% at 15% 35%, rgba(153,255,51,0.10), transparent 60%)",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
            <div className="text-center">
              <img
                src="https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png"
                alt="SnapGain"
                className="h-16 sm:h-20 w-auto mx-auto mb-5"
              />

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-header2)" }}
                >
                  Turn Everyday Spending Into Airline Tickets
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 sm:mt-6 text-base sm:text-xl max-w-3xl mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                The ultimate guide for immigrants in the UK who want to travel
                more without breaking the bank — using cashback, points and smart
                stacking strategies.
              </motion.p>

              {ctaBlock}

              <div
                className="mt-4 text-xs sm:text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                No downloads • Secure member access • Your purchases unlock your
                library
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT THE EBOOK */}
        <section className="py-10 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-[var(--radius-xl)] shadow-lg p-6 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(125,77,251,0.18)",
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles
                  className="h-6 w-6"
                  style={{ color: "var(--color-purple)" }}
                />
                <h2
                  className="text-2xl sm:text-4xl font-extrabold text-center"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                  }}
                >
                  About the eBook
                </h2>
              </div>

              <p
                className="text-sm sm:text-lg text-center max-w-4xl mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                This eBook reveals the exact step-by-step framework to earn
                cashback in the UK, stack rewards with gift cards and credit
                cards, and convert points into real flight savings. It’s written
                for beginners — and structured for action.
              </p>

              <div className="mt-7 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {[
                  "Recover money from everyday spending using smart cashback and points strategies.",
                  "Convert groceries, bills, subscriptions and daily purchases into airline miles.",
                  "Avoid common mistakes that cost immigrants thousands in missed rewards.",
                  "Use points strategically to book flights with savings up to 100% (rules & availability apply).",
                  "Learn stacking examples (cashback + gift card + card points) to maximise every purchase.",
                  "Read inside SnapGain (no download) so updates are always central and sharing is reduced.",
                ].map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle
                      className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                      style={{ color: "var(--color-neon-green)" }}
                    />
                    <p
                      className="text-sm sm:text-base"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PREMIUM CALCULATOR */}
        <section className="py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-[var(--radius-xl)] shadow-lg p-6 sm:p-10 text-center"
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(125,77,251,0.18)",
              }}
            >
              <div className="flex justify-center mb-3">
                <Calculator
                  className="h-10 w-10"
                  style={{ color: "var(--color-purple)" }}
                />
              </div>

              <h3
                className="text-2xl sm:text-4xl font-extrabold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span style={{ color: "var(--color-purple)" }}>
                  Premium Calculator Tool{" "}
                </span>
                
              </h3>

              <p
                className="mt-4 max-w-3xl mx-auto text-sm sm:text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                We’re building a powerful suite of calculators to help you
                compare conversion rates, optimise your earnings, and make
                data-driven decisions about your points and cashback.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="button"
                  size="lg"
                  className="text-white font-extrabold px-10 py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
                  style={{ backgroundImage: "var(--gradient-header)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startCheckout(PREMIUM_SLUG);
                  }}
                >
                  Unlock {PREMIUM_LABEL}
                </Button>

                <Button
                  asChild
                  size="lg"
                  className="text-white font-extrabold px-8 py-6 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
                  style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
                >
                  <Link to="/library">
                    <Lock className="mr-2 h-6 w-6" />
                    View in Member Area
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EbookLandingPage;