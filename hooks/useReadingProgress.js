import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useReadingProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  // Helper to save immediately
  const saveProgressImmediate = useCallback(async (productId, locale, chapterNumber, scrollY = 0) => {
    if (!user) return;
    
    try {
      // First, get existing record id if it exists (since upsert by composite key might need explicit unique constraint)
      const { data: existing } = await supabase
        .from('reading_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('locale', locale)
        .maybeSingle();

      const payload = {
        user_id: user.id,
        product_id: productId,
        locale,
        chapter_number: chapterNumber,
        scroll_y: scrollY,
        last_seen_at: new Date().toISOString(),
        last_chapter_number: chapterNumber
      };

      if (existing?.id) {
        payload.id = existing.id;
      }

      const { error } = await supabase
        .from('reading_progress')
        .upsert(payload, { onConflict: 'id' });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  }, [user]);

  // Debounced save for scroll events
  const saveProgress = useCallback((productId, locale, chapterNumber, scrollY) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      saveProgressImmediate(productId, locale, chapterNumber, scrollY);
    }, 2500); // 2.5 seconds debounce
  }, [saveProgressImmediate]);

  const getLastPosition = useCallback(async (productId, locale) => {
    if (!user) return null;
    setLoading(true);
    try {
      let query = supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId);
        
      // If locale is provided, filter by it. Otherwise, get the absolute last seen for the product.
      if (locale) {
        query = query.eq('locale', locale);
      }
      
      const { data, error } = await query
        .order('last_seen_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting last position:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getProgressPercentage = useCallback((currentChapter, totalChapters) => {
    if (!totalChapters || totalChapters === 0) return 0;
    return Math.round((currentChapter / totalChapters) * 100);
  }, []);

  return {
    saveProgress,
    saveProgressImmediate,
    getLastPosition,
    getProgressPercentage,
    loading
  };
};