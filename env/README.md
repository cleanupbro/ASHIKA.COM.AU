# Environment Configuration

## Setup Instructions

### Development

1. Copy the example file:
   ```bash
   cp env/.env.example .env.local
   ```

2. Fill in your API keys:
   - **Supabase**: Get from [Supabase Dashboard](https://supabase.com/dashboard)
   - **Stripe**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - **Australia Post**: Get from [AusPost Developer Portal](https://developers.auspost.com.au/)

3. Start development:
   ```bash
   npm run dev
   ```

### Production (Vercel)

Set environment variables in the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Use production API keys (not test keys)

## Environment Files

| File | Purpose | Git |
|------|---------|-----|
| `.env.example` | Template with placeholder values | ✅ Committed |
| `.env.local` | Local development config | ❌ Ignored |
| `.env.testing` | Test environment config | ❌ Ignored |
| `.env.production.local` | Local production test | ❌ Ignored |

## Mock Data Mode

For development without API keys:

```bash
# In .env.local
USE_MOCK_DATA=true
```

This enables mock data for:
- Products
- Bookings
- User authentication

## Required vs Optional

### Required for Full Functionality
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Optional
- `AUSPOST_API_KEY` (shipping features)
- `RESEND_API_KEY` (email notifications)
- `NEXT_PUBLIC_GA_ID` (analytics)

## Security Notes

- Never commit `.env.local` or any file with real API keys
- Use test keys for development (pk_test_, sk_test_)
- Rotate keys if accidentally exposed
- Review `.gitignore` to ensure env files are excluded
