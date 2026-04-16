# Import eBook from DOCX

This utility script allows you to import an eBook from a DOCX file directly into your Supabase database. It converts the document to HTML, extracts and uploads images to Supabase Storage, and splits the content into chapters.

## Prerequisites

1. **Node.js**: Ensure Node.js is installed.
2. **Dependencies**: Run `npm install` to install `mammoth` and other required packages.
3. **Database**: Ensure the `products` table has the product you are importing (e.g., `slug='from-cashback-to-flights'`).
4. **Migration**: Run the SQL migration `supabase/migrations/add_chapters_unique_constraint.sql` in your Supabase SQL Editor.

## Environment Variables

Create a `.env` file or export these variables in your shell: