import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { BookOpen, Loader2, ChevronLeft, ChevronRight, Globe, Lock, PlayCircle } from "lucide-react";
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
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { getAllChapters } from "@/lib/chapters";

const ReaderHub = () => {
  const { productSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLastPosition, getProgressPercentage } = useReadingProgress();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [locales, setLocales] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);
  const [chapters, setChapters] = useState([]);

  const selectedLocale = searchParams.get("locale") || "en";

  const currentLocale = useMemo(
    () => locales.find((l) => l.locale === selectedLocale) || locales[0],
    [locales, selectedLocale]
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!user) {
        setLoading(false);
        navigate("/login");
        return;
      }

      if (!productSlug) {
        navigate("/library");
        return;
      }

      try {
        setLoading(true);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id, slug")
          .eq("slug", productSlug)
          .single();

        if (productError) throw productError;

        const { data: purchase, error: purchaseError } = await supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", productData.id)
          .eq("status", "paid")
          .maybeSingle();

        if (purchaseError) throw purchaseError;

        if (!purchase) {
          if (!cancelled) setHasAccess(false);
          setLoading(false);
          return;
        }

        const { data: localesData } = await supabase
          .from("product_locales")
          .select("*")
          .eq("product_id", productData.id)
          .eq("is_published", true);

        const chapterRows = await getAllChapters(productData.id, selectedLocale);
        const position = await getLastPosition(productData.id, selectedLocale);

        if (cancelled) return;

        setProduct(productData);
        setHasAccess(true);
        setLocales(localesData || []);
        setChapters(chapterRows || []);
        setLastPosition(position || null);

        if (!searchParams.get("locale") && (localesData || []).length > 0) {
          setSearchParams({ locale: localesData[0].locale });
        }
      } catch (error) {
        console.error("Error init reader hub:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [productSlug, user, navigate, searchParams, selectedLocale, getLastPosition, setSearchParams]);

  const handleLocaleChange = async (val) => {
    setSearchParams({ locale: val });

    if (product?.id) {
      const chapterRows = await getAllChapters(product.id, val);
      const position = await getLastPosition(product.id, val);
      setChapters(chapterRows || []);
      setLastPosition(position || null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[var(--color-purple)]" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <Lock className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You must purchase this book to read it.</p>
        <Link to="/library">
          <Button>Back to Library</Button>
        </Link>
      </div>
    );
  }

  const totalDisplay = chapters.length || 1;
  const continueChapter = lastPosition?.chapter_number || 1;

  return (
    <>
      <Helmet>
        <title>{currentLocale?.title || "Reader"} - SnapGain</title>
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/library"
            className="text-sm font-medium text-[var(--color-purple)] hover:underline mb-6 block flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Library
          </Link>

          <div className="flex flex-col md:flex-row gap-8 mb-12 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <img
              src={currentLocale?.cover_image_url}
              alt={currentLocale?.title}
              className="w-48 h-auto object-cover rounded-lg shadow-md self-center md:self-start"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3 text-gray-900">{currentLocale?.title}</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">{currentLocale?.description}</p>

              {locales.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-700">
                    <Globe className="h-4 w-4" /> Language
                  </p>
                  <Select value={selectedLocale} onValueChange={handleLocaleChange}>
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locales.map((l) => (
                        <SelectItem key={l.locale} value={l.locale}>
                          {l.locale === "en" ? "English" : l.locale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link to={`/reader/${productSlug}/${selectedLocale}/${continueChapter}`}>
                  <Button className="bg-[var(--color-purple)] hover:bg-[var(--color-purple)]/90 text-white shadow-sm">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {lastPosition ? "Continue Reading" : "Start Reading"}
                  </Button>
                </Link>

                {lastPosition && (
                  <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    Chapter {continueChapter} of {totalDisplay} -{" "}
                    {getProgressPercentage(continueChapter, totalDisplay)}% complete
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-900">Table of Contents</h2>
          <div className="grid gap-3">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/reader/${productSlug}/${selectedLocale}/${chapter.chapter_number}`}
              >
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[var(--color-purple)]/50 hover:shadow-md transition-all flex justify-between items-center group">
                  <div>
                    <span className="text-xs font-bold text-[var(--color-purple)] uppercase tracking-wider mb-1 block">
                      Chapter {chapter.chapter_number}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--color-purple)] transition-colors">
                      {chapter.title}
                    </h3>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-[var(--color-purple)] h-5 w-5 transition-colors" />
                </div>
              </Link>
            ))}

            {chapters.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500 italic">No chapters found in Supabase.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReaderHub;