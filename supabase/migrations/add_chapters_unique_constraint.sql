-- Add unique constraint to prevent duplicate chapters for the same locale
ALTER TABLE chapters
ADD CONSTRAINT chapters_product_id_locale_chapter_number_key 
UNIQUE (product_id, locale, chapter_number);

-- Add index for faster lookups by locale
CREATE INDEX IF NOT EXISTS idx_chapters_product_locale 
ON chapters (product_id, locale);

-- Add index for faster navigation queries (ordering by chapter_number)
CREATE INDEX IF NOT EXISTS idx_chapters_navigation 
ON chapters (product_id, chapter_number);

-- Rollback (commented out)
-- ALTER TABLE chapters DROP CONSTRAINT chapters_product_id_locale_chapter_number_key;
-- DROP INDEX idx_chapters_product_locale;
-- DROP INDEX idx_chapters_navigation;