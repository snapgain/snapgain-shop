import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mammoth from 'mammoth';
import { createClient } from '@supabase/supabase-js';

// Configuration from Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'ebook-assets';
const PRODUCT_SLUG = process.env.PRODUCT_SLUG || 'from-cashback-to-flights';
const LOCALE = process.env.LOCALE || 'en';

// CLI Arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/import-ebook-docx.mjs <path-to-docx-file>');
  process.exit(1);
}
const docxPath = args[0];

if (!fs.existsSync(docxPath)) {
  console.error(`Error: File not found at path: ${docxPath}`);
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// Initialize Supabase Admin Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log(`Starting import for ${PRODUCT_SLUG} (${LOCALE})...`);
  console.log(`Reading file: ${docxPath}`);

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
    const productId = product.id;
    console.log(`Found product ID: ${productId}`);

    // 2. Ensure Storage Bucket Exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.find(b => b.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${STORAGE_BUCKET}`);
      const { error: bucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true
      });
      if (bucketError) throw new Error(`Failed to create bucket: ${bucketError.message}`);
    }

    // 3. Convert DOCX to HTML with Image Extraction
    console.log('Converting DOCX to HTML...');
    
    const options = {
      convertImage: mammoth.images.imgElement(async (image) => {
        const buffer = await image.read().then(b => Buffer.from(b));
        const hash = crypto.createHash('md5').update(buffer).digest('hex');
        const extension = image.contentType.split('/')[1] || 'png';
        const filename = `${hash}.${extension}`;
        const storagePath = `ebooks/${PRODUCT_SLUG}/${LOCALE}/${filename}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, buffer, {
            contentType: image.contentType,
            upsert: true
          });

        if (uploadError) {
          console.error(`Failed to upload image ${filename}:`, uploadError);
          return { src: '' }; // Placeholder on failure
        }

        // Return Public URL
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath);
        
        return { src: publicUrl, alt: 'Book illustration' };
      })
    };

    const result = await mammoth.convertToHtml({ path: docxPath }, options);
    let htmlContent = result.value;
    const messages = result.messages;

    if (messages.length > 0) {
      console.log('Conversion messages:', messages);
    }

    // 4. Split Content into Chapters
    // Strategy: Look for specific markers like "PART I:", "PART II:", etc.
    // NOTE: This logic assumes markers are in <h1> or <p> tags or just plain text in the HTML.
    // A more robust approach might be needed depending on the exact DOCX formatting, 
    // but regex splitting on these keywords is a good start.
    
    // Cleaning up some Mammoth output artifacts if necessary
    // Removing scripts just in case
    htmlContent = htmlContent.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");

    // Regex to find "PART X:" or "Chapter X:" patterns if they exist as headers.
    // Adjust this regex based on the actual book structure. 
    // Example: <h1>PART I: Title</h1>
    // We will split by a regex that looks for these headers.
    
    // First, let's normalize the markers to ensure we catch them.
    // We'll treat the entire content as Chapter 1 if no markers are found, 
    // or split if we find them.
    
    // Splitting by "PART " followed by Roman numerals or numbers
    const parts = htmlContent.split(/(?=PART\s+[IVX]+[:.]?|CHAPTER\s+\d+[:.]?)/i);
    
    // If no split happened, maybe it's "Introduction" or just one big blob
    const chaptersToImport = [];
    
    if (parts.length === 1) {
      console.log('No "PART" or "CHAPTER" markers found. Importing as single chapter.');
      chaptersToImport.push({
        chapter_number: 1,
        title: 'Complete Book',
        content: parts[0]
      });
    } else {
      // Process parts
      parts.forEach((partHtml, index) => {
        if (!partHtml.trim()) return; // Skip empty parts

        // Try to extract title from the first few lines/tags
        // Strip tags to get text
        const textOnly = partHtml.replace(/<[^>]+>/g, ' ').trim();
        const firstLine = textOnly.split('.')[0].substring(0, 100); // Rough title extraction
        
        let title = firstLine || `Chapter ${index + 1}`;
        
        // Refine title if it starts with "PART X:"
        const match = title.match(/^(PART\s+[IVX]+[:.]?|CHAPTER\s+\d+[:.]?)\s*(.*)/i);
        if (match && match[2]) {
          title = match[2].trim();
        }

        // If it's the very first part and has no real content or just a title, skip or merge?
        // For now, we add it.
        chaptersToImport.push({
          chapter_number: index + 1,
          title: title,
          content: partHtml
        });
      });
    }

    // 5. Upsert Chapters to Database
    console.log(`Identified ${chaptersToImport.length} chapters.`);
    
    for (const chapter of chaptersToImport) {
      console.log(`Upserting Chapter ${chapter.chapter_number}: "${chapter.title}"`);
      
      const { error: upsertError } = await supabase
        .from('chapters')
        .upsert({
          product_id: productId,
          locale: LOCALE,
          chapter_number: chapter.chapter_number,
          title: chapter.title,
          html_content: chapter.content
        }, {
          onConflict: 'product_id, locale, chapter_number'
        });

      if (upsertError) {
        console.error(`Error upserting chapter ${chapter.chapter_number}:`, upsertError);
      }
    }

    console.log('✅ Import completed successfully!');

  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

main();