# SnapGain Local HTML eBook Reader Setup

This guide explains how to set up, use, and troubleshoot the client-side HTML eBook reader parser and caching system.

## 1. Setup Instructions

1.  **Place the HTML File**: Ensure your eBook HTML file is named exactly `snapgain-ebook.html` and is placed in the `/public/ebooks/` directory of your project. 
    *   Path: `public/ebooks/snapgain-ebook.html`
    *   The file must use `<h1>` tags for chapter titles and `<h2>` tags for sub-sections.
    *   Images referenced in the HTML should also be placed in `public/` and use relative paths (e.g., `<img src="/images/cover.jpg">`).

## 2. Parser Usage Examples

The `ebookParser` automatically fetches the HTML file from the public directory and structures it.