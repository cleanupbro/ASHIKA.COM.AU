# API Key Registry

Master list of all API keys, tokens, and credentials this project uses.

**⚠️ NEVER put actual key values in this file. Only names and metadata.**

## Active Keys

| Service | Env Variable | Purpose | Get It From | Used In |
|---------|-------------|---------|-------------|---------|
| | | | | |

<!-- Example entries:
| Supabase | NEXT_PUBLIC_SUPABASE_URL | Database URL | Supabase Dashboard > Settings > API | src/lib/supabase.ts |
| Supabase | NEXT_PUBLIC_SUPABASE_ANON_KEY | Public anon key | Supabase Dashboard > Settings > API | src/lib/supabase.ts |
| Supabase | SUPABASE_SERVICE_ROLE_KEY | Server-only admin key | Supabase Dashboard > Settings > API | src/lib/supabase-admin.ts |
| Vercel | VERCEL_TOKEN | Deploy from CI | Vercel Dashboard > Settings > Tokens | .github/workflows/deploy.yml |
| Stripe | STRIPE_SECRET_KEY | Payment processing | Stripe Dashboard > Developers > API keys | src/services/payments.ts |
| Stripe | NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Client-side Stripe.js | Stripe Dashboard > Developers > API keys | src/components/CheckoutForm.tsx |
| OpenAI | OPENAI_API_KEY | AI completions | platform.openai.com/api-keys | src/services/ai.ts |
| Square | SQUARE_ACCESS_TOKEN | POS and invoicing | Square Developer Dashboard | src/services/square.ts |
| n8n | N8N_WEBHOOK_URL | Automation trigger | n8n instance webhook node | src/services/automation.ts |
-->

## Key Rotation Schedule

| Service | Last Rotated | Next Rotation | Rotated By |
|---------|-------------|---------------|------------|
| | | | |

## Environment Setup

```bash
# 1. Copy the template
cp .env.example .env

# 2. Fill in values from the sources above

# 3. For Vercel, set via dashboard or CLI:
vercel env add VARIABLE_NAME

# 4. Verify all keys are set:
# Check .env has no empty values
grep -E "^[A-Z].*=$" .env  # Shows any empty keys
```

## Security Rules

1. Never commit `.env` files to Git (`.gitignore` handles this)
2. Use different keys for dev/staging/production
3. Rotate keys immediately if exposed
4. Use server-only env vars for sensitive keys (no `NEXT_PUBLIC_` prefix)
5. Revoke unused keys promptly

---

<!-- Update this file whenever an API integration is added or removed. -->
