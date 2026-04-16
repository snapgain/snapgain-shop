import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Loader2,
  Globe,
  Lock,
  Calculator,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

const EBOOK_SLUG = "from-cashback-to-flights";
const CALC_SLUG = "premium-calculator";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasEbook, setHasEbook] = useState(false);
  const [hasCalculator, setHasCalculator] = useState(false);
  const [ebookProduct, setEbookProduct] = useState(null);
  const [purchaseRequired, setPurchaseRequired] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!user) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setPurchaseRequired(false);

        const { data: purchases, error: purchasesError } = await supabase
          .from("purchases")
          .select("product_id")
          .eq("user_id", user.id)
          .eq("status", "paid");

        if (purchasesError) throw purchasesError;

        const purchasedProductIds = (purchases || []).map((p) => p.product_id);

        if (!purchasedProductIds.length) {
           if (cancelled) return;
           setHasEbook(false);
           setHasCalculator(false);
           setEbookProduct(null);
           setPurchaseRequired(true);
           return;
        }

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("id, slug")
          .in("id", purchasedProductIds);

        if (productsError) throw productsError;

        const purchasedSlugs = (productsData || []).map((p) => p.slug);
        
        const nextHasEbook = purchasedSlugs.includes(EBOOK_SLUG);
        const nextHasCalc = purchasedSlugs.includes(CALC_SLUG);

        if (cancelled) return;

        setHasEbook(nextHasEbook);
        setHasCalculator(nextHasCalc);

        if (nextHasEbook) {
          const ebook = (productsData || []).find((p) => p.slug === EBOOK_SLUG);

          if (!ebook?.id) {
            setEbookProduct(null);
          } else {
            const { data: locales, error: localesError } = await supabase
              .from("product_locales")
              .select("*")
              .eq("product_id", ebook.id)
              .eq("is_published", true);

            if (localesError) throw localesError;

            const { data: chapterCounts, error: ccErr } = await supabase
              .from("chapters")
              .select("locale, chapter_number, product_id")
              .eq("product_id", ebook.id)
              .in("locale", (locales || []).map(l => l.locale));

            if (ccErr) throw ccErr;

            const totals = {};
            (chapterCounts || []).forEach((c) => {
              totals[c.locale] = Math.max(totals[c.locale] || 0, c.chapter_number || 0);
            });

            const { data: progressRows, error: prErr } = await supabase
              .from("reading_progress")
              .select("locale, chapter_number, last_chapter_number, last_seen_at")
              .eq("user_id", user.id)
              .eq("product_id", ebook.id);

            if (prErr) throw prErr;

            const progressByLocale = {};
            (progressRows || []).forEach((r) => {
              progressByLocale[r.locale] = {
                chapter_number: r.chapter_number ?? null,
                last_chapter_number: r.last_chapter_number ?? null,
                last_seen_at: r.last_seen_at ?? null,
              };
            });

            if (cancelled) return;

            setEbookProduct({
              ...ebook,
              locales: locales || [],
              totalsByLocale: totals,
              progressByLocale,
            });
          }
        } else {
          setEbookProduct(null);
        }
      } catch (error) {
        console.error("Error fetching library:", error);
        if (!cancelled) {
          setHasEbook(false);
          setHasCalculator(false);
          setEbookProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[var(--color-purple)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Library - SnapGain</title>
        <meta name="description" content="Your SnapGain member library" />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-10"
          >
            <h1
              className="text-4xl font-extrabold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              My Library
            </h1>
            <p className="text-[var(--text-secondary)]">
              Your purchased products appear here. Locked items can be purchased anytime.
            </p>

            {purchaseRequired && (
              <div
                className="mt-5 rounded-[var(--radius-lg)] p-4"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(125,77,251,0.18)",
                }}
              >
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-[var(--color-purple)] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      Purchase required
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      We couldn't find a paid purchase on this account. If you bought with a different
                      email, log in with that one — or purchase access below.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hasEbook && ebookProduct ? (
              <EbookProductCard product={ebookProduct} />
            ) : (
              <LockedEbookCard />
            )}

            {hasCalculator ? <CalculatorUnlockedCard /> : <CalculatorLockedCard />}
          </div>
        </div>
      </div>
    </>
  );
};

const EbookProductCard = ({ product }) => {
  const defaultLocale = product.locales?.[0]?.locale || "en";
  const [selectedLocale, setSelectedLocale] = useState(defaultLocale);

  const currentLocale =
    product.locales?.find((l) => l.locale === selectedLocale) || product.locales?.[0];

  const total = product.totalsByLocale?.[selectedLocale] || 0;
  const prog = product.progressByLocale?.[selectedLocale] || {};
  const last = Number(prog.last_chapter_number || prog.chapter_number || 1);
  const pct = total ? Math.min(100, Math.round((last / total) * 100)) : 0;

  const lastSeenText = prog.last_seen_at
    ? new Date(prog.last_seen_at).toLocaleString()
    : null;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="aspect-[3/2] relative overflow-hidden">
        {currentLocale?.cover_image_url ? (
          <img
            src={currentLocale.cover_image_url}
            alt={currentLocale.title || "SnapGain eBook"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/40">
            <BookOpen className="h-12 w-12 text-[var(--color-purple)]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-white font-extrabold text-lg truncate">
                {currentLocale?.title || "Your eBook"}
              </div>
              <div className="text-white/90 text-sm">
                {pct > 0 ? `${pct}% read • Continue where you left off` : "Purchased • Ready to start"}
              </div>
            </div>

            <div className="text-white/90 text-xs font-semibold">
              {total ? `Ch ${Math.min(last, total)} / ${total}` : `Ch ${last}`}
            </div>
          </div>

          <div className="mt-3 h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.22)" }}>
            <div
              className="h-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, var(--color-purple), var(--color-pink))",
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
          {currentLocale?.description || "Open your eBook in the reader."}
        </p>

        {product.locales?.length > 1 && (
          <div className="mb-4">
            <Label className="text-xs text-[var(--text-secondary)] mb-2 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Language
            </Label>

            <Select value={selectedLocale} onValueChange={setSelectedLocale}>
              <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--color-purple)]/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {product.locales.map((loc) => (
                  <SelectItem key={loc.locale} value={loc.locale}>
                    {loc.locale === "en" ? "🇬🇧 English" : loc.locale === "pt" ? "🇧🇷 Português" : loc.locale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {lastSeenText && (
          <div className="text-xs text-[var(--text-secondary)] mb-4">
            Last activity: <span className="font-semibold">{lastSeenText}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link to={`/reader/${product.slug}/${selectedLocale}/${Math.max(1, last)}`}>
            <Button
              className="w-full text-white font-extrabold"
              style={{ backgroundImage: "var(--gradient-header2)" }}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {pct > 0 ? "Continue Reading" : "Start Reading"}
            </Button>
          </Link>

          <Link to={`/reader/${product.slug}?locale=${selectedLocale}`}>
            <Button variant="outline" className="w-full font-extrabold">
              View chapters
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const LockedEbookCard = () => {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-[var(--radius-xl)] shadow-lg overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(125,77,251,0.18)",
      }}
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(125,77,251,0.12)" }}
          >
            <Lock className="h-6 w-6 text-[var(--color-purple)]" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
              From Cashback to Flights (eBook)
            </h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Locked — purchase required
            </p>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] mb-6">
          Get access to the full guide and read it securely inside your SnapGain member area (no downloads).
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://buy.stripe.com/7sY14h0t02f7fDj5lhafS00"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              className="w-full text-white font-extrabold"
              style={{ backgroundImage: "var(--gradient-header2)" }}
            >
              Buy eBook
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const CalculatorLockedCard = () => {
  const { toast } = useToast();
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    try {
      setBuying(true);
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { product_slug: CALC_SLUG }
      });

      if (error) throw error;
      if (!data?.url) throw new Error("Checkout URL missing");
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: e?.message || "Try again.",
      });
      setBuying(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-[var(--radius-xl)] shadow-lg overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(125,77,251,0.18)",
      }}
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(153,255,51,0.12)" }}
          >
            <Calculator className="h-6 w-6" style={{ color: "var(--color-purple)" }} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
              Premium Calculator Tool
            </h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Locked — purchase required
            </p>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] mb-4">
          Compare conversion rates and maximise rewards with SnapGain calculators.
          When you purchase, it unlocks here automatically.
        </p>

        <ul className="text-[var(--text-secondary)] text-sm space-y-2 mb-6">
          <li>• Avios vs RevPoints comparator</li>
          <li>• Cashback ROI calculator</li>
          <li>• Nectar → Avios converter</li>
          <li>• Multi-platform wallet dashboard</li>
        </ul>

        <Button
          onClick={handleBuy}
          disabled={buying}
          className="w-full text-white font-extrabold"
          style={{ backgroundImage: "var(--gradient-header2)" }}
        >
          {buying ? (
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting...</>
          ) : (
             "Buy Calculator"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const CalculatorUnlockedCard = () => {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(153,255,51,0.12)" }}
          >
            <Calculator className="h-6 w-6" style={{ color: "var(--color-purple)" }} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
              Premium Calculator Tool
            </h3>
            <p className="text-[var(--text-secondary)] text-sm">Unlocked • Ready</p>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] mb-6">
          Your calculator suite is unlocked. Open it inside SnapGain.
        </p>

        <Link to="/calculator">
          <Button
            className="w-full text-white font-extrabold"
            style={{ backgroundImage: "var(--gradient-header2)" }}
          >
            Open Calculator
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const Label = ({ children, className }) => <label className={className}>{children}</label>;

export default LibraryPage;