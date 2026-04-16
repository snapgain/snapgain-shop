import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';
import { convertImagePaths } from '../src/lib/imagePathConverter.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID; // Needed for storage URL construction
const SOURCE_DIR = process.argv[2];
const PRODUCT_SLUG = 'from-cashback-to-flights';
const LOCALE = 'en';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_PROJECT_ID) {
  console.error('Error: Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PROJECT_ID).');
  process.exit(1);
}

if (!SOURCE_DIR || !fs.existsSync(SOURCE_DIR)) {
  console.error('Usage: node scripts/import-ebook-chapters.mjs <source_directory_with_html_files>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Storage URL Base: https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[product]/[locale]
const STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/ebook-assets/${PRODUCT_SLUG}/${LOCALE}`;

async function main() {
  console.log(`Starting import from: ${SOURCE_DIR}`);
  console.log(`Target Product: ${PRODUCT_SLUG}`);
  console.log(`Storage Base URL: ${STORAGE_BASE_URL}`);

  try {
    // 1. Get Product ID
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', PRODUCT_SLUG)
      .single();

    if (productError || !product) {
      throw new Error(`Product not found for slug: ${PRODUCT_SLUG}`);
    }
    console.log(`Found Product ID: ${product.id}`);

    // 2. Scan Directory
    const files = fs.readdirSync(SOURCE_DIR)
      .filter(file => file.endsWith('.html') || file.endsWith('.htm'))
      .sort(); // Sort to hopefully match chapter order if named correctly (01.html, 02.html)

    console.log(`Found ${files.length} HTML files.`);

    for (const [index, file] of files.entries()) {
      const filePath = path.join(SOURCE_DIR, file);
      let rawContent = fs.readFileSync(filePath, 'utf-8');

      // 3. Extract Title (First H1)
      const titleMatch = rawContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].trim() : `Chapter ${index + 1}`;

      // 4. Convert Image Paths
      let processedContent = convertImagePaths(rawContent, STORAGE_BASE_URL);

      // 5. Sanitize HTML
      processedContent = sanitizeHtml(processedContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h1', 'h2', 'span', 'div' ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': [ 'src', 'alt', 'width', 'height', 'style' ],
          '*': [ 'style', 'class', 'id' ]
        },
        allowedSchemes: [ 'http', 'https', 'data' ]
      });

      // 6. Upsert Chapter
      // Assuming filenames are ordered: 1.html -> Chapter 1, or use loop index + 1
      const chapterNumber = index + 1;

      console.log(`Importing Chapter ${chapterNumber}: "${title}" (${file})`);

      const { error: upsertError } = await supabase
        .from('chapters')
        .upsert({
          product_id: product.id,
          locale: LOCALE,
          chapter_number: chapterNumber,
          title: title,
          html_content: processedContent
        }, {
          onConflict: 'product_id, locale, chapter_number'
        });

      if (upsertError) {
        console.error(`Failed to upsert chapter ${chapterNumber}:`, upsertError.message);
      } else {
        console.log(`✅ Chapter ${chapterNumber} saved.`);
      }
    }

    console.log('Import completed.');

  } catch (err) {
    console.error('Fatal Error:', err);
    process.exit(1);
  }
}

main();