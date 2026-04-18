const cleanEbookHTML = (html) => {
  if (!html) return '';
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Encontra a tag <style> embutida e adiciona regras de dark mode
  const styleTag = doc.querySelector('style');
  if (styleTag) {
    // Adiciona regras dark mode ao final do CSS existente
    styleTag.textContent += `
      /* DARK MODE AUTO-INJECTED */
      .dark .sg,
      .dark .sg *:not(svg):not(path):not(circle) {
        color: #ffffff !important;
      }
      .dark .sg h1,
      .dark .sg h2,
      .dark .sg h3 {
        color: #ffffff !important;
      }
      .dark .sg-section-bg {
        background: rgba(30, 41, 59, 0.9) !important;
        border-color: rgba(100, 116, 139, 0.3) !important;
      }
      .dark .sg-family-box,
      .dark .sg-cost-box {
        background: rgba(51, 65, 85, 0.5) !important;
        border-color: rgba(100, 116, 139, 0.3) !important;
      }
      .dark .sg-warn {
        background: rgba(51, 65, 85, 0.8) !important;
        border-color: rgba(100, 116, 139, 0.3) !important;
      }
      .dark .sg-quote-box {
        background: rgba(30, 41, 59, 0.9) !important;
        border-color: #6366f1 !important;
      }
      .dark .sg-chev {
        background: rgba(30, 41, 59, 0.9) !important;
        border-color: rgba(100, 116, 139, 0.3) !important;
      }
      .dark .sg-blockquote {
        background: rgba(30, 41, 59, 0.9) !important;
        border-color: #6366f1 !important;
      }
      .dark .sg-cost-highlight {
        background: #fbbf24 !important;
        color: #1a1a1a !important;
      }
    `;
  }
  
  return doc.body.innerHTML;
};