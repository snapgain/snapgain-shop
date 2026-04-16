/**
 * Cleans text by removing HTML tags, extra whitespace, and leading numbering.
 */
export function cleanText(text) {
  if (!text) return '';
  let cleaned = text.replace(/<[^>]*>?/gm, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/^\s*\d+(\.\d+)*\s+/, '');
  return cleaned.trim();
}

/**
 * Rewrites relative paths for assets to point to the correct public directory.
 */
export function normalizeAssetPaths(html) {
  if (!html) return '';
  return html.replace(/(src|href)=["']([^"']+)["']/gi, (match, attr, url) => {
    if (url.match(/^(http:\/\/|https:\/\/|\/\/|data:)/i)) {
      return match;
    }
    if (url.startsWith('snapgain-ebook_files/')) {
      return `${attr}="https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/Ebooks/${url}"`;
    }
    return match;
  });
}

/**
 * Extracts sections for a chapter based on h2/h3 tags (internal navigation).
 * Kept simple as requested to not break other parser functionality.
 */
export function extractSections(contentHtml) {
  if (!contentHtml) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentHtml, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3'));
  const sections = [];
  
  headings.forEach((h, index) => {
    const secTitle = cleanText(h.textContent);
    if (secTitle) {
      sections.push({
        title: secTitle,
        anchor_id: h.id || `section-${index + 1}`
      });
    }
  });
  return sections;
}

/**
 * Parses the eBook HTML file and extracts structured chapters.
 * Implements robust multi-strategy chapter detection.
 */
export async function parseEbook() {
  try {
    const response = await fetch('https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/Ebooks/Snapgain-ebook.html');
    if (!response.ok) {
      throw new Error(`Failed to load eBook HTML: ${response.status} ${response.statusText}`);
    }
    
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Counts for Strategy 1
    const h1Count = doc.querySelectorAll('h1').length;
    const h2Count = doc.querySelectorAll('h2').length;
    const h3Count = doc.querySelectorAll('h3').length;

    console.log(`Strategy 1 (Heading): h2 count = ${h2Count}, h3 count = ${h3Count}`);

    let markers = [];
    let method = '';
    let markerLogType = '';

    // STRATEGY 1 - Heading-based detection
    if (h2Count >= 5) {
      markers = Array.from(doc.querySelectorAll('h2'));
      method = 'Heading';
      markerLogType = 'h2';
    } else if (h3Count >= 5) {
      markers = Array.from(doc.querySelectorAll('h3'));
      method = 'Heading';
      markerLogType = 'h3';
    } else {
      // STRATEGY 2 - Class-based detection
      const classElements = Array.from(doc.querySelectorAll('p[class], div[class]'));
      const classFreq = {};
      
      classElements.forEach(el => {
        const cls = el.className;
        if (typeof cls === 'string') {
          cls.split(/\s+/).forEach(c => {
            if (c) classFreq[c] = (classFreq[c] || 0) + 1;
          });
        }
      });

      const keywords = ['chapter', 'heading', 'title', 'section', 'h1', 'h2', 'h3'];
      let bestClass = null;
      let maxCount = 0;

      for (const [cls, count] of Object.entries(classFreq)) {
        const lower = cls.toLowerCase();
        if (keywords.some(k => lower.includes(k)) && count >= 5 && count > maxCount) {
          bestClass = cls;
          maxCount = count;
        }
      }

      if (bestClass) {
        markers = Array.from(doc.querySelectorAll(`.${bestClass}`));
        method = 'Class';
        markerLogType = `class="${bestClass}"`;
      } else {
        // STRATEGY 3 - Text pattern detection
        const textNodes = Array.from(doc.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6'));
        markers = textNodes.filter(el => {
          if (el.children.length > 2) return false; // Skip large wrappers
          
          const text = el.textContent.trim();
          if (!text) return false;

          const isAllCaps = text === text.toUpperCase() && text.length > 4 && /[A-Z]/.test(text);
          const startsWithNum = /^\d+(\.\d+)*\s+[A-Za-z]/.test(text);
          const containsKeyword = /^(Chapter|Section)\s*\d+/i.test(text);

          return isAllCaps || startsWithNum || containsKeyword;
        });

        method = 'Text Pattern';
        markerLogType = 'text pattern';
      }
    }

    console.log(`Using ${markerLogType} as chapter marker`);

    // Helper to traverse DOM and collect all content safely
    function getNextNode(node, skipChildren, root) {
      if (!skipChildren && node.firstChild) return node.firstChild;
      while (node && node !== root) {
        if (node.nextSibling) return node.nextSibling;
        node = node.parentNode;
      }
      return null;
    }
    
    const chapters = [];
    let chapterCounter = 1;
    
    // Process markers and split content
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      
      let title = cleanText(marker.textContent);
      
      // Skip typical front matter
      if (title.toLowerCase().includes('table of contents')) {
        continue;
      }

      title = title.replace(/^[^\w\s]+/, '').trim();
      if (!title) title = `Chapter ${chapterCounter}`;
      
      const nextMarker = markers[i + 1];
      
      let contentHtml = marker.outerHTML || '';
      let currentElement = getNextNode(marker, true, doc.body);
      
      while (currentElement && currentElement !== nextMarker) {
        if (nextMarker && currentElement.nodeType === 1 && currentElement.contains(nextMarker)) {
          currentElement = getNextNode(currentElement, false, doc.body);
        } else {
          if (currentElement.nodeType === 1) { 
            contentHtml += currentElement.outerHTML;
          } else if (currentElement.nodeType === 3) { 
            const tmp = doc.createElement('div');
            tmp.appendChild(currentElement.cloneNode());
            contentHtml += tmp.innerHTML;
          }
          currentElement = getNextNode(currentElement, true, doc.body);
        }
      }
      
      // Extract sub-sections for internal chapter navigation
      const sections = extractSections(contentHtml);
      
      chapters.push({ 
        chapter_number: chapterCounter++, 
        title, 
        content_html: normalizeAssetPaths(contentHtml), 
        sections 
      });
    }

    console.log(`Total chapters parsed: ${chapters.length}`);
    const first3 = chapters.slice(0, 3).map(c => c.title).join(', ');
    console.log(`First 3 chapter titles: ${first3}`);

    // Save stats for the debug panel
    try {
      localStorage.setItem('ebook_debug_stats', JSON.stringify({
        h1: h1Count,
        h2: h2Count,
        h3: h3Count,
        method: method,
        chapters: chapters.length
      }));
    } catch (e) {
      // ignore localstorage errors
    }

    return chapters;
    
  } catch (error) {
    console.error('Chapter parsing error:', error);
    throw error;
  }
}