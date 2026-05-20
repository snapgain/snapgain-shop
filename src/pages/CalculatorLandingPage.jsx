// 2026-05-20 (v2): Refactored from "calculator product landing" into
// pure MARKETING LANDING for the main snapgain.uk Premium product.
//
// Calculator was integrated into the main app (snapgain.uk/calculator)
// — this shop repo is now just a marketing surface that:
//   1. Hooks the visitor with the value prop ("free calc, real savings")
//   2. Lets them try a FREE preview calculator inline (no signup)
//   3. Pushes them to snapgain.uk/auth/signup for the full Premium
//
// snapgain.shop domain is paid until 2026-09-09 — Bárbara's call to
// keep it alive as a separate funnel that captures a "calculator-
// curious" audience and converts them to the £14.99/mo Premium.

import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Calculator,
  Sparkles,
  TrendingUp,
  Plane,
  BadgePoundSterling,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const MAIN_APP_URL = "https://snapgain.uk";
const MAIN_APP_SIGNUP = `${MAIN_APP_URL}/auth/signup`;
const MAIN_APP_CALCULATOR = `${MAIN_APP_URL}/calculator`;

// Inline FREE preview: a single mini-calculator (cashback vs Avios)
// gated to encourage signup for the full suite. Same math as the
// main app's CashbackVsAviosCalculator.
const GBP_PER_AVIOS = 0.0092;

function MiniCalc() {
  const [cb, setCb] = useState("");
  const [av, setAv] = useState("");
  const [amt, setAmt] = useState("");

  const result = useMemo(() => {
    const cbN = parseFloat(cb) || 0;
    const avN = parseFloat(av) || 0;
    const amtN = parseFloat(amt) || 0;
    if (amtN <= 0) return null;
    const cashbackValue = (cbN / 100) * amtN;
    const aviosFromCashback = Math.round(cashbackValue / GBP_PER_AVIOS);
    const aviosDirect = Math.round(avN * amtN);
    return {
      aviosFromCashback,
      aviosDirect,
      winner: aviosFromCashback > aviosDirect ? "cashback" : "avios",
      diff: Math.abs(aviosFromCashback - aviosDirect),
      cashbackValue,
    };
  }, [cb, av, amt]);

  return (
    <div
      className="rounded-[var(--radius-xl)] shadow-lg p-6 sm:p-8"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(125,77,251,0.2)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Calculator
          className="h-5 w-5"
          style={{ color: "var(--color-purple)" }}
        />
        <h3
          className="text-lg sm:text-xl font-extrabold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Try it: Cashback vs Avios eStore
        </h3>
      </div>
      <p
        className="text-xs sm:text-sm mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        Quick check — which gives you more Avios on the same spend?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <Label htmlFor="mc-cb">Cashback %</Label>
          <Input
            id="mc-cb"
            type="number"
            step="0.1"
            placeholder="10"
            value={cb}
            onChange={(e) => setCb(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mc-av">Avios per £1</Label>
          <Input
            id="mc-av"
            type="number"
            step="0.1"
            placeholder="4"
            value={av}
            onChange={(e) => setAv(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mc-amt">Amount (£)</Label>
          <Input
            id="mc-amt"
            type="number"
            step="0.01"
            placeholder="100"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {result && (
        <motion.div
          key={result.winner + result.diff}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4 text-center"
          style={{
            background: "var(--gradient-header2)",
            color: "white",
          }}
        >
          <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
            Winner
          </p>
          <p className="text-2xl font-extrabold">
            {result.winner === "cashback"
              ? `Cashback → Booster (${result.aviosFromCashback.toLocaleString()} Avios)`
              : `Avios eStore (${result.aviosDirect.toLocaleString()} Avios)`}
          </p>
          <p className="text-xs opacity-90 mt-1">
            Beats the other by {result.diff.toLocaleString()} Avios
          </p>
        </motion.div>
      )}

      {!result && (
        <div
          className="rounded-lg p-4 text-center text-sm"
          style={{
            background: "rgba(255,255,255,0.5)",
            border: "1px dashed rgba(125,77,251,0.3)",
            color: "var(--text-secondary)",
          }}
        >
          Drop in real numbers above to see the winner.
        </div>
      )}

      <p
        className="text-xs text-center mt-4"
        style={{ color: "var(--text-secondary)" }}
      >
        ✨ 3 more calculators + the full Comparison Engine inside SnapGain Premium
      </p>
    </div>
  );
}

const CalculatorLandingPage = () => {
  const FEATURES = [
    {
      icon: BadgePoundSterling,
      title: "Compare 11,000+ retailers",
      detail:
        "Type any UK store + amount — Premium shows the best cashback or Avios route.",
    },
    {
      icon: TrendingUp,
      title: "Stack like a pro",
      detail:
        "Curated playbook with NX + Airtime + Avios combos that hit 25%+ returns.",
    },
    {
      icon: Plane,
      title: "All your point conversions",
      detail:
        "Nectar → Avios, RevPoints → Avios, Booster maths — done in one screen.",
    },
    {
      icon: Sparkles,
      title: "Hot deals tracked daily",
      detail:
        "Boosted rates from TopCashback, Quidco, and JamDoughnut surfaced automatically.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Free Cashback & Avios Calculator | SnapGain</title>
        <meta
          name="description"
          content="Free UK cashback & Avios calculator. Compare strategies instantly. Then unlock the full SnapGain Premium for the comparison engine + curated playbook."
        />
      </Helmet>

      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 40% at 50% 0%, rgba(125,77,251,0.18), transparent 60%), radial-gradient(40% 30% at 80% 20%, rgba(255,63,206,0.12), transparent 60%), radial-gradient(40% 30% at 15% 35%, rgba(153,255,51,0.10), transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
            <div className="text-center">
              <img
                src="https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png"
                alt="SnapGain"
                className="h-14 sm:h-18 w-auto mx-auto mb-4"
              />

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-header2)" }}
                >
                  Free Cashback &amp; Avios Calculator
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-base sm:text-lg max-w-2xl mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                Try the math below — then unlock the full SnapGain Premium
                for the comparison engine across 11,000+ UK stores.
              </motion.p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href={MAIN_APP_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    type="button"
                    size="lg"
                    className="text-white font-extrabold px-8 py-5 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl transition"
                    style={{ backgroundImage: "var(--gradient-header2)" }}
                  >
                    Start 7-day free trial — £14.99/mo after
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a
                  href={MAIN_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: "var(--color-purple)" }}
                >
                  or visit snapgain.uk
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div
                className="mt-3 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                No card required for trial · Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* FREE PREVIEW CALCULATOR */}
        <section className="py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <MiniCalc />
          </div>
        </section>

        {/* WHAT'S IN PREMIUM */}
        <section className="py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-[var(--radius-xl)] shadow-lg p-6 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(125,77,251,0.18)",
              }}
            >
              <h2
                className="text-2xl sm:text-4xl font-extrabold text-center mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What's inside SnapGain Premium
              </h2>
              <p
                className="text-center max-w-3xl mx-auto mb-8 text-sm sm:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                The calculator above is one of <strong>four</strong> in Premium —
                and the bigger value is the comparison engine that knows every
                cashback platform, every Avios rate, and every stacking trick.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {FEATURES.map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="flex gap-3">
                    <Icon
                      className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                      style={{ color: "var(--color-neon-green)" }}
                    />
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {title}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href={MAIN_APP_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="text-white font-extrabold px-8 py-5 rounded-[var(--radius-lg)] shadow-lg hover:shadow-xl"
                    style={{ backgroundImage: "var(--gradient-header)" }}
                  >
                    Try Premium free for 7 days
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <p
                  className="mt-2 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  £14.99/mo or £120/yr · cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-[var(--radius-xl)] shadow-lg p-6 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(125,77,251,0.18)",
              }}
            >
              <h3
                className="text-2xl sm:text-3xl font-extrabold text-center mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Built for UK families that want flights home for free
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {[
                  "UK immigrants juggling NX Rewards, TopCashback, Quidco and Avios.",
                  "Anyone shopping at supermarkets, fuel stations or department stores who wants every £ to count.",
                  "Travellers planning a flight home and wondering whether to convert Nectar, RevPoints, or buy Avios via Booster.",
                  "Beginners who want a clear number — not a 30-minute spreadsheet — before they checkout.",
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
      </div>
    </>
  );
};

export default CalculatorLandingPage;
