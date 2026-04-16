# SnapGain Shop — Setup Guide

## Files
- `index.html`   → Landing/sales page
- `reader.html`  → Ebook reader (requires purchase)
- `success.html` → Post-purchase confirmation page
- `config.js`    → Configuration (Supabase keys)
- `vercel.json`  → Vercel routing
- `README.md`    → This file

## Setup Steps

### 1. Get your Supabase Anon Key
1. Go to supabase.com → your project (SnapGain Calculadoras)
2. Settings → API
3. Copy the "anon public" key

### 2. Set Environment Variables in Vercel
In your Vercel project settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL` = https://auhtwkvwbgvekvwctcaj.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key from step 1)

OR edit config.js directly and paste the anon key.

### 3. Connect Domain
In Vercel → your project → Settings → Domains
Add: snapgain.shop

Then in Hostinger domain settings, change DNS:
- Remove existing A records
- Add CNAME: @ → cname.vercel-dns.com

### 4. Cancel Horizon
In Hostinger dashboard → cancel the Horizon AI subscription ($9.99/mo)

### 5. Cancel Hosting (after domain switch confirmed)
Once snapgain.shop points to Vercel and works — cancel Hostinger hosting ($13.99/mo)

## Supabase Project
- Project ID: auhtwkvwbgvekvwctcaj
- URL: https://auhtwkvwbgvekvwctcaj.supabase.co
- Product ID: d88f9512-d0b9-4fb5-9773-72ff4dd86d3b
