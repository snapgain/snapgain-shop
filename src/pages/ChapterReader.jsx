import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { getAllChapters, getChapter, getChapterSections } from "@/lib/chapters";
import { supabase } from "@/lib/supabaseClient";
import "@/styles/readerContent.css";

const ChapterReader = () => {
  // ═══════════════════════════════════════════════════════════
  // FUNÇÃO PARA LIMPAR HTML DO E-BOOK E INJETAR DARK MODE
  // ═══════════════════════════════════════════════════════════
  const cleanEbookHTML = (html) => {
    if (!html) return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Encontra a tag <style> embutida e adiciona regras de dark mode
    const styleTag = doc.querySelector('style');
    if (styleTag) {
      // Adiciona regras dark mode ao final do CSS existente
      styleTag.textContent += `
        /* DARK MODE AUTO-INJECTED */
        .dark .sg,
        .dark .sg *:not(svg):not(path):not(circle) {
          color: #ffffff !important;
        }
        .dark .sg h1,
        .dark .sg h2,
        .dark .sg h3 {
          color: #ffffff !important;
        }
        .dark .sg-section-bg {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: rgba(100, 116, 139, 0.3) !important;
        }
        .dark .sg-family-box,
        .dark .sg-cost-box {
          background: rgba(51, 65, 85, 0.5) !important;
          border-color: rgba(100, 116, 139, 0.3) !important;
        }
        .dark .sg-warn {
          background: rgba(51, 65, 85, 0.8) !important;
          border-color: rgba(100, 116, 139, 0.3) !important;
        }
        .dark .sg-quote-box {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: #6366f1 !important;
        }
        .dark .sg-chev {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: rgba(100, 116, 139, 0.3) !important;
        }
        .dark .sg-blockquote {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: #ffffff !important;
        }
        .dark .sg-cost-highlight {
          background: #fbbf24 !important;
          color: #ffffff !important;
        }
      `;
    }
    
    return doc.body.innerHTML;
  };

  const { productSlug, locale = "en", chapterNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveProgress, saveProgressImmediate, getLastPosition } = useReadingProgress();

  const currentChapter = parseInt(chapterNumber, 10) || 1;
  const readerTopRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [sections, setSections] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialScrollRestored, setInitialScrollRestored] = useState(false);

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        setError("");

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id, slug")
          .eq("slug", productSlug)
          .single();

        if (productError) throw productError;

        const [chapterData, sectionsData, allChaptersData] = await Promise.all([
          getChapter(productData.id, locale, currentChapter),
          getChapterSections(productData.id, locale, currentChapter),
          getAllChapters(productData.id, locale),
        ]);

        setProduct(productData);
        setChapter(chapterData);
        setSections(sectionsData);
        setAllChapters(allChaptersData);
      } catch (err) {
        console.error("Error loading chapter:", err);
        setError(err?.message || "Failed to load chapter");
      } finally {
        setLoading(false);
      }
    }

    loadChapter();
  }, [productSlug, locale, currentChapter]);

  const totalChapters = allChapters.length || 1;
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;
  const progressPercentage = totalChapters
    ? Math.round((currentChapter / totalChapters) * 100)
    : 0;

  useEffect(() => {
    let active = true;

    const restoreScroll = async () => {
      if (!loading && !error && chapter && user && product && !initialScrollRestored) {
        const progress = await getLastPosition(product.id, locale);

        if (
          active &&
          progress &&
          progress.chapter_number === currentChapter &&
          progress.scroll_y > 0
        ) {
          setTimeout(() => {
            window.scrollTo({ top: progress.scroll_y, behavior: "auto" });
          }, 150);
        }

        if (active) setInitialScrollRestored(true);
      }
    };

    restoreScroll();
    return () => {
      active = false;
    };
  }, [
    loading,
    error,
    chapter,
    user,
    product,
    locale,
    currentChapter,
    initialScrollRestored,
    getLastPosition,
  ]);

  useEffect(() => {
    if (!loading && !error && chapter && user && product) {
      saveProgressImmediate(product.id, locale, currentChapter, Math.round(window.scrollY));
    }
  }, [loading, error, chapter, user, product, locale, currentChapter, saveProgressImmediate]);

  useEffect(() => {
    const handleScroll = () => {
      if (initialScrollRestored && product) {
        saveProgress(product.id, locale, currentChapter, Math.round(window.scrollY));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialScrollRestored, product, locale, currentChapter, saveProgress]);

  useEffect(() => {
    setInitialScrollRestored(false);
    if (readerTopRef.current) {
      readerTopRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentChapter]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... | SnapGain Reader</title>
        </Helmet>
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--color-purple)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading Chapter {currentChapter}...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !chapter) {
    return (
      <>
        <Helmet>
          <title>Error Loading Chapter | SnapGain Reader</title>
        </Helmet>
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-800 mb-2">Error Loading Chapter</h2>
            <p className="text-red-600 mb-4">{error || "An unexpected error occurred."}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline" className="bg-white">
                Retry
              </Button>
              <Button onClick={() => navigate("/library")}>
                Back to Library
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{chapter.title} - SnapGain Reader</title>
        <meta name="description" content={`Read ${chapter.title} on SnapGain.`} />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] pb-20" ref={readerTopRef}>
        <div className="max-w-3xl mx-auto px-4 py-8 relative">
          <div className="mb-8 border-b border-gray-200 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center relative z-20">
            <Link
              to={`/reader/${productSlug}?locale=${locale}`}
              className="text-sm font-medium text-[var(--color-purple)] hover:underline flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Table of Contents
            </Link>

            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-700 font-semibold">
                Chapter {currentChapter} of {totalChapters}
              </span>
              <span className="text-xs text-gray-500">{progressPercentage}% complete</span>
            </div>
          </div>

          {sections.length > 0 && (
            <div className="mb-6 rounded-xl border p-4 bg-white/70 relative z-20">
              <h3 className="font-bold mb-3">In this chapter</h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.anchor_id}`}
                      className="text-[var(--color-purple)] hover:underline"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex flex-col">
              <div
                className="sticky top-1/2 flex w-full justify-center items-center -translate-y-1/2"
                style={{ position: "sticky" }}
              >
                <span
                  className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-400 rotate-[-20deg]"
                  style={{ opacity: 0.15, userSelect: "none", whiteSpace: "nowrap" }}
                >
                  {user?.email || "Licensed content – SnapGain"}
                </span>
              </div>
            </div>

            <div
              className="chapter-content relative z-20"
              dangerouslySetInnerHTML={{ __html: cleanEbookHTML(chapter.html_content) }}
            />
          </motion.div>

          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200 relative z-20">
            {hasPrev ? (
              <Link to={`/reader/${productSlug}/${locale}/${currentChapter - 1}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" disabled>
                Previous
              </Button>
            )}

            {hasNext ? (
              <Link to={`/reader/${productSlug}/${locale}/${currentChapter + 1}`}>
                <Button className="gap-2 bg-[var(--color-purple)] text-white hover:bg-[var(--color-purple)]/90">
                  Next Chapter
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to={`/reader/${productSlug}?locale=${locale}`}>
                <Button variant="outline">Finish</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterReader;
