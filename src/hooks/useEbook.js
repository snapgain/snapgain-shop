import { useState, useEffect } from 'react';
import { ebookCache } from '@/lib/ebookCache';
import { useNavigate } from 'react-router-dom';

export function useEbook(initialChapter = 1) {
  const [chapters, setChapters] = useState([]);
  const [totalChapters, setTotalChapters] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const loadMetadata = async () => {
      try {
        setLoading(true);
        const all = await ebookCache.getAllChapters();
        const total = await ebookCache.getTotalChapters();
        
        if (mounted) {
          setChapters(all);
          setTotalChapters(total);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load ebook metadata');
          setLoading(false);
        }
      }
    };

    loadMetadata();
    return () => { mounted = false; };
  }, []);

  const goToChapter = (num) => {
    if (num >= 1 && num <= totalChapters) {
      setCurrentChapter(num);
      navigate(`/ebook/${num}`);
    }
  };

  const nextChapter = () => goToChapter(currentChapter + 1);
  const prevChapter = () => goToChapter(currentChapter - 1);

  const getTotalChapters = () => totalChapters;
  const getChapterMetadata = (num) => {
    return chapters.find(c => c.chapter_number === num) || null;
  };

  return {
    chapters,
    totalChapters,
    currentChapter,
    setCurrentChapter,
    goToChapter,
    nextChapter,
    prevChapter,
    loading,
    error,
    getTotalChapters,
    getChapterMetadata
  };
}

export function useChapterContent(chapterNumber) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadChapter = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`useChapterContent: Searching for chapter ${chapterNumber} (type: ${typeof chapterNumber}, numbering system: 1-indexed integer)`);
        
        const html = await ebookCache.getChapterContent(chapterNumber);
        
        if (!html) {
          // Instead of throwing an unhandled error, set the error state safely
          if (mounted) {
            setContent(null);
            setError('Chapter not found');
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setContent(html);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load chapter content');
          setLoading(false);
        }
      }
    };

    loadChapter();
    return () => { mounted = false; };
  }, [chapterNumber]);

  return { content, loading, error };
}

export function useCurrentSection() {
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [currentSectionTitle, setCurrentSectionTitle] = useState('');

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2[id^="section-"]'));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSectionId(entry.target.id);
            setCurrentSectionTitle(entry.target.textContent);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  const observeSections = () => {
    const headings = Array.from(document.querySelectorAll('h2[id^="section-"]'));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setCurrentSectionId(visible[0].target.id);
          setCurrentSectionTitle(visible[0].target.textContent);
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return observer;
  };

  return { currentSectionId, currentSectionTitle, observeSections };
}