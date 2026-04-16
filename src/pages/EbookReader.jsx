import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEbook, useChapterContent, useCurrentSection } from '@/hooks/useEbook';
import SectionNav from '@/components/SectionNav';
import { Progress } from '@/components/ui/progress';

const EbookReader = () => {
  const { chapterNumber } = useParams();
  const currentNum = parseInt(chapterNumber, 10) || 1;
  const navigate = useNavigate();

  const { 
    totalChapters, 
    nextChapter, 
    prevChapter, 
    loading: bookLoading,
    setCurrentChapter
  } = useEbook(currentNum);

  const { 
    content, 
    metadata, 
    loading: chapterLoading, 
    error 
  } = useChapterContent(currentNum);

  const { currentSectionId, observeSections } = useCurrentSection();
  const observerRef = useRef(null);

  useEffect(() => {
    setCurrentChapter(currentNum);
  }, [currentNum, setCurrentChapter]);

  useEffect(() => {
    if (!chapterLoading && content) {
      // Re-initialize intersection observer when content changes
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      setTimeout(() => {
        observerRef.current = observeSections();
        
        // Handle hash navigation on initial load
        if (window.location.hash) {
          const id = window.location.hash.substring(1);
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
           window.scrollTo(0, 0);
        }
      }, 100);
    }
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [content, chapterLoading, observeSections]);

  const progressPercentage = totalChapters > 0 ? (currentNum / totalChapters) * 100 : 0;

  if (bookLoading || chapterLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center pt-20">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--color-purple)] mb-4" />
        <p className="text-[var(--text-secondary)]">Loading Chapter {currentNum}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Chapter</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
            <Button onClick={() => navigate('/library')}>Back to Library</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!metadata) return null;

  return (
    <>
      <Helmet>
        <title>Chapter {currentNum}: {metadata.title} | SnapGain Reader</title>
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] pb-24">
        {/* Top Progress Bar */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-4">
            <Link to="/library" className="text-[var(--text-secondary)] hover:text-[var(--color-purple)] transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
              Chapter {currentNum} of {totalChapters}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-36 lg:flex lg:gap-12 lg:items-start">
          
          {/* Main Content Area */}
          <main className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-12 leading-tight">
                {metadata.title}
              </h1>

              <div 
                className="prose prose-lg md:prose-xl prose-slate max-w-none text-[var(--text-primary)] ebook-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </motion.div>

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-[var(--border)] flex justify-between items-center">
              <Button
                variant="outline"
                size="lg"
                onClick={prevChapter}
                disabled={currentNum <= 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Chapter
              </Button>

              <Button
                size="lg"
                onClick={nextChapter}
                disabled={currentNum >= totalChapters}
                className="gap-2 bg-[var(--color-purple)] hover:bg-[var(--color-purple)]/90 text-white"
              >
                Next Chapter
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </main>

          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0 relative">
            <SectionNav sections={metadata.sections} currentSectionId={currentSectionId} />
          </aside>

        </div>
      </div>
    </>
  );
};

export default EbookReader;