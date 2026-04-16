# SnapGain E-Book Reader Platform

A modern, PWA-enabled e-book reader platform with passwordless authentication, Stripe payments, and multi-language support.

## Features

### Reader Features
- 📱 **Progressive Web App (PWA)** - Install on any device for offline reading
- 🔐 **Passwordless Authentication** - Magic link login via email
- 🌍 **Multi-language Support** - English, Portuguese, Spanish
- 🎨 **Customizable Reading Experience** - Dark/light themes, adjustable font sizes
- 📖 **Reading Progress Tracking** - Automatically saves your place
- 💳 **Stripe Integration** - Secure payment processing
- 📧 **Email Notifications** - Welcome emails via Resend

### Technical Features
- React 18 with Router v6
- Supabase for backend (Auth, Database, Edge Functions)
- TailwindCSS with custom design tokens
- Framer Motion animations
- Row Level Security (RLS) policies
- Service Worker for offline functionality

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd snapgain-ebook
npm install
\`\`\`

### 2. Environment Variables

Create a \`.env\` file:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Database Setup

Run the database migrations in Supabase SQL Editor:
- Creates tables: products, product_locales, purchases, chapters
- Sets up RLS policies
- Seeds sample data for "From Cashback to Flights" e-book

### 4. Supabase Edge Function Secrets

Configure these secrets in your Supabase project:

\`\`\`bash
# Required for verify-stripe-webhook function
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
SITE_URL=https://snapgain.shop
\`\`\`

### 5. Stripe Webhook Configuration

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: \`https://your-project.supabase.co/functions/v1/verify-stripe-webhook\`
3. Select event: \`checkout.session.completed\`
4. Copy webhook signing secret to Supabase secrets

### 6. Resend Email Setup

1. Create account at resend.com
2. Verify your sending domain
3. Get API key and add to Supabase secrets
4. Set FROM_EMAIL to your verified email

## Development

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Building for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Header.jsx             # App header with navigation
│   ├── OfflineDetector.jsx    # Offline status banner
│   ├── InstallPrompt.jsx      # PWA install prompt
│   └── ProtectedRoute.jsx     # Auth route wrapper
├── contexts/
│   └── SupabaseAuthContext.jsx # Auth state management
├── hooks/
│   ├── useReadingProgress.js  # Reading progress localStorage
│   ├── useTheme.js            # Dark/light theme toggle
│   └── useFontSize.js         # Font size preferences
├── pages/
│   ├── EbookLandingPage.jsx   # Marketing landing page
│   ├── EbookLoginPage.jsx     # Magic link authentication
│   ├── LibraryPage.jsx        # User's purchased e-books
│   ├── ReaderHub.jsx          # Chapter selection
│   ├── ChapterReader.jsx      # Chapter reading view
│   ├── AccountPage.jsx        # User account management
│   └── OfflinePage.jsx        # Offline fallback
├── styles/
│   └── design-tokens.css      # SnapGain brand colors & variables
└── App.jsx                    # Main app with routing
\`\`\`

## PWA Installation

### Desktop
1. Visit the site in Chrome/Edge
2. Click install icon in address bar
3. App opens in standalone window

### Mobile
1. Visit site in mobile browser
2. Tap "Add to Home Screen"
3. App installs like native app

## Architecture

### Authentication Flow
1. User enters email on login page
2. Supabase sends magic link email
3. User clicks link → auto-login
4. Redirect to library

### Purchase Flow
1. Customer completes Stripe checkout
2. Stripe sends webhook to Edge Function
3. Function creates/finds user account
4. Function records purchase in database
5. Function sends welcome email via Resend
6. Customer receives email with library link

### Reading Flow
1. User logs in with magic link
2. Fetches purchased products from database
3. Selects product and language
4. Views chapter list
5. Reads chapters with auto-saved progress
6. RLS policies ensure only paid access

### Offline Support
- Service Worker caches app shell
- Reading progress stored in localStorage
- Offline page shown when network unavailable
- Can read previously loaded chapters offline

## Security

### Row Level Security Policies
- **purchases**: Users can only see their own purchases
- **product_locales**: Only published locales visible
- **chapters**: Only accessible with valid paid purchase
- **products**: Public read access

### Authentication
- Magic link authentication (no passwords)
- JWT tokens managed by Supabase
- Automatic session refresh
- Protected routes check auth state

## Customization

### Adding New Products
1. Insert into \`products\` table with unique slug
2. Add locales to \`product_locales\`
3. Add chapters to \`chapters\` table
4. Update Stripe product metadata if needed

### Adding Languages
1. Add new locale to \`product_locales\`
2. Set \`is_published = true\` when ready
3. Add chapters for new locale
4. Language automatically appears in selectors

### Styling
- Edit \`src/styles/design-tokens.css\` for colors
- Brand colors: Purple (#7D4DFB), Pink (#FF3FCE), Neon Green (#99FF33)
- All components use CSS variables for consistency

## Deployment

### Recommended: Vercel/Netlify
\`\`\`bash
npm run build
# Deploy dist/ folder
\`\`\`

### Environment Variables (Production)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### Post-Deployment
1. Update SITE_URL in Supabase secrets
2. Update Stripe webhook endpoint URL
3. Test magic link emails
4. Test PWA installation
5. Verify offline functionality

## Troubleshooting

### Magic Links Not Sending
- Check Supabase email templates enabled
- Verify email provider settings
- Check spam folder

### Purchases Not Recording
- Verify Stripe webhook URL is correct
- Check webhook signing secret matches
- Review Edge Function logs

### Offline Mode Not Working
- Ensure service worker is registered
- Check browser console for SW errors
- Verify HTTPS in production

## Support

Email: support@snapgain.uk

## License

© 2024 SnapGain. All rights reserved.
\`\`\`