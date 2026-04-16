/**
 * Replaces relative image paths in HTML content with public Supabase Storage URLs.
 * 
 * Handles formats:
 * - "xxx.files/image001.png"
 * - "assets/image001.png"
 * - "./images/image001.png"
 * 
 * @param {string} htmlContent - The raw HTML string.
 * @param {string} bucketBasePath - The base URL for the Supabase bucket folder (e.g., "https://xyz.supabase.co/storage/v1/object/public/ebook-assets/product-slug/locale").
 * @returns {string} The HTML with updated image sources.
 */
export function convertImagePaths(htmlContent, bucketBasePath) {
  if (!htmlContent) return "";
  
  // Ensure base path doesn't end with slash to avoid double slashes
  const baseUrl = bucketBasePath.replace(/\/$/, "");

  return htmlContent.replace(/src=["']([^"']+)["']/g, (match, src) => {
    // Skip if already an absolute URL (http/https) or data URI
    if (src.match(/^(http|https|data):/)) {
      return match;
    }

    // Extract filename from path
    // Handles: "folder/image.png", "./image.png", "image.png"
    const filename = src.split(/[/\\]/).pop();
    
    // Construct new URL
    const newSrc = `${baseUrl}/${filename}`;
    
    return `src="${newSrc}"`;
  });
}