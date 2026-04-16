/**
 * Injects invisible watermarks into HTML content using multiple methods.
 * 1. HTML comments (easily found if looking for source code).
 * 2. Hidden data attributes on random elements (semi-stealth).
 * 3. Zero-width characters (invisible to humans, hard to detect/strip).
 *
 * @param {string} htmlContent - The raw HTML content of the chapter.
 * @param {string} watermarkHash - The unique user/session hash to inject.
 * @returns {string} - The watermarked HTML.
 */
export function injectInvisibleWatermark(htmlContent, watermarkHash) {
  if (!htmlContent || !watermarkHash) return htmlContent;

  let watermarkedHtml = htmlContent;

  // Method 1: Inject HTML Comment at the beginning and end
  // This is the most obvious method, but serves as a first line of attribution.
  const commentWatermark = `<!-- ID: ${watermarkHash} -->`;
  watermarkedHtml = `${commentWatermark}\n${watermarkedHtml}\n${commentWatermark}`;

  // Method 2: Inject data-id attribute into a wrapper or first tag if possible
  // We'll wrap the content in a div that carries the watermark, if it's not already wrapped
  // Or we can just prepend a hidden span.
  const hiddenMarker = `<span style="display:none" data-tracking-id="${watermarkHash}"></span>`;
  watermarkedHtml = hiddenMarker + watermarkedHtml;

  // Method 3: Zero-Width Character Injection (Steganography)
  // We can convert the hash into a sequence of zero-width characters.
  // Common Zero-Width Chars:
  // U+200B (Zero Width Space)
  // U+200C (Zero Width Non-Joiner)
  // U+200D (Zero Width Joiner)
  // U+FEFF (Zero Width No-Break Space)
  //
  // Simple binary encoding:
  // 0 -> U+200B
  // 1 -> U+200C
  //
  // We'll insert this sequence into the first text node we find, or just append it.
  
  const binaryString = stringToBinary(watermarkHash);
  const zeroWidthString = binaryToZeroWidth(binaryString);

  // Insert invisible string into the first paragraph or header if possible
  // Otherwise just append to end (it's invisible anyway)
  if (watermarkedHtml.includes("</p>")) {
    watermarkedHtml = watermarkedHtml.replace("</p>", `${zeroWidthString}</p>`);
  } else if (watermarkedHtml.includes("</div>")) {
    watermarkedHtml = watermarkedHtml.replace("</div>", `${zeroWidthString}</div>`);
  } else {
    watermarkedHtml += zeroWidthString;
  }

  return watermarkedHtml;
}

/**
 * Helper: Convert string to binary string representation
 */
function stringToBinary(str) {
  return str
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

/**
 * Helper: Convert binary string to zero-width characters
 * 0 -> U+200B (Zero Width Space)
 * 1 -> U+200C (Zero Width Non-Joiner)
 */
function binaryToZeroWidth(binaryStr) {
  return binaryStr
    .split("")
    .map((bit) => (bit === "1" ? "\u200C" : "\u200B"))
    .join("");
}