import { supabase } from "@/lib/supabaseClient";

/**
 * Fetches all chapters for a specific product and locale.
 * Returns only necessary metadata for navigation/TOC.
 */
export async function getAllChapters(productId, locale) {
  const { data, error } = await supabase
    .from('chapters')
    .select('id, product_id, locale, chapter_number, title')
    .eq('product_id', productId)
    .eq('locale', locale)
    .order('chapter_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetches a single chapter with its full HTML content.
 */
export async function getChapter(productId, locale, chapterNumber) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('product_id', productId)
    .eq('locale', locale)
    .eq('chapter_number', chapterNumber)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetches all sections (headings/anchors) for a specific chapter.
 */
/** export async function getChapterSections(productId, locale, chapterNumber) {
  const { data, error } = await supabase
    .from('chapter_sections')
    .select('*')
    .eq('product_id', productId)
    .eq('locale', locale)
    .eq('chapter_number', chapterNumber)
    .order('section_number', { ascending: true });

  if (error) throw error;
  return data || [];
}**/

/**
 * Fetches all sections (headings/anchors) for a specific chapter.
 */
export async function getChapterSections(productId, locale, chapterNumber) {
  console.log('🔍 getChapterSections called with:', {
    productId,
    locale,
    chapterNumber,
    types: {
      productId: typeof productId,
      locale: typeof locale,
      chapterNumber: typeof chapterNumber
    }
  });

  const { data, error } = await supabase
    .from('chapter_sections')
    .select('*')
    .eq('product_id', productId)
    .eq('locale', locale)
    .eq('chapter_number', chapterNumber)
    .order('section_number', { ascending: true });

  console.log('🔍 Supabase response:', { data, error });

  if (error) {
    console.error('❌ Supabase error:', error);
    throw error;
  }

  return data || [];
}
