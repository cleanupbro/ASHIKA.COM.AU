# Environment & API Key Management
## ASHIKA Development Configuration

---

## Directory Structure

```
ashika/
├── env/
│   ├── .env.example          # Template (committed to git)
│   ├── .env.local            # Active dev keys (gitignored)
│   ├── .env.testing          # Claude's test keys (gitignored)
│   └── .env.production       # Production keys (gitignored, stored securely)
```

---

## .env.example (Template)

```bash
# ============================================================
# ASHIKA Environment Configuration
# ============================================================
# Copy this file to .env.local and fill in your values.
# NEVER commit .env.local to git.
# ============================================================

# === APPLICATION ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ASHIKA

# === SUPABASE ===
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === STRIPE ===
# Get these from: https://dashboard.stripe.com/apikeys
# Use test keys for development (pk_test_, sk_test_)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# === AUSTRALIA POST ===
# Get these from: https://developers.auspost.com.au/
AUSPOST_API_KEY=your_auspost_api_key
AUSPOST_ACCOUNT_NUMBER=your_account_number

# === OPTIONAL: EMAIL (Phase 2+) ===
# RESEND_API_KEY=re_xxxxx

# === OPTIONAL: AI TRY-ON (Phase 2) ===
# REPLICATE_API_TOKEN=r8_xxxxx

# ============================================================
# LLM DEVELOPMENT KEYS (Optional - for workspace tools only)
# ============================================================
# These are NOT used by the application, only by development tools
# like Claude Code or Gemini for code generation assistance.
#
# ANTHROPIC_API_KEY=sk-ant-xxxxx
# GOOGLE_AI_API_KEY=xxxxx
# ============================================================
```

---

## .env.testing (Claude's Test Keys)

This file is for Claude Code to use during development and testing. It will be gitignored and should contain test/sandbox API keys only.

```bash
# ============================================================
# ASHIKA Testing Environment (Claude Code)
# ============================================================
# This file contains temporary test keys for development.
# These keys have LIMITED permissions and are for testing only.
# ============================================================

# Supabase (Test Project)
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key
SUPABASE_SERVICE_ROLE_KEY=test_service_key

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_testing
STRIPE_SECRET_KEY=sk_test_testing
STRIPE_WEBHOOK_SECRET=whsec_testing

# Australia Post (Sandbox)
AUSPOST_API_KEY=test_auspost_key

# ============================================================
# ⚠️  WARNING: DO NOT USE PRODUCTION KEYS IN THIS FILE
# ============================================================
```

---

## API Key Protection Rules

### Absolute Prohibitions

```
🚫 NEVER access these paths (ANY LLM, ANY context):
   
   ~/master-keys/
   ~/.anthropic/
   ~/.config/google-cloud/
   ~/.aws/credentials
   ~/.ssh/
   ~/.*_api_key*
   
   Any path containing:
   - "master"
   - "production"
   - "secret"
   - "private"
```

### Allowed Operations

```
✅ MAY read (for runtime only):
   ./env/.env.local
   ./env/.env.testing
   process.env.* (at runtime)

✅ MAY write (with explicit instruction):
   ./env/.env.testing (for test setup)
   ./env/.env.example (to update template)

✅ MAY suggest (but not execute):
   Commands that SET environment variables
   Changes to .env files
```

### Verification Checklist

Before any operation involving environment files or API keys:

- [ ] Is this path in the ALLOWED list?
- [ ] Am I reading, not writing?
- [ ] If writing, is this .env.testing or .env.example only?
- [ ] Will this key appear in any committed file?
- [ ] Will this key appear in console output?
- [ ] Will this key appear in error messages?

If ANY answer is "no" or uncertain: **STOP and ask the user**.

---

## Client Key Handover Process

When the client provides their API keys:

### Step 1: Client Creates .env.local

```bash
# Client runs this:
cp env/.env.example env/.env.local
# Then edits .env.local with their keys
```

### Step 2: Verify .gitignore

Ensure these lines exist in `.gitignore`:

```
# Environment files with real keys
.env.local
.env.production
.env.testing
.env*.local

# Never commit keys
*.pem
*.key
*_rsa
*_dsa
*_ed25519
*_ecdsa
```

### Step 3: Claude Removes Test Keys

Once client provides production-ready .env.local:

```bash
# Remove test environment file
rm env/.env.testing

# Verify no test keys in codebase
grep -r "sk_test_testing" . --include="*.ts" --include="*.tsx"
# Should return nothing
```

### Step 4: Production Deployment

For Vercel deployment, client sets environment variables in Vercel dashboard:
- Never commit production keys to any file
- Use Vercel's encrypted environment variables
- Set different keys for Preview vs Production

---

## Key Rotation Protocol

If any key is compromised:

1. **Immediately** revoke the key in the provider's dashboard
2. Generate a new key
3. Update .env.local (local development)
4. Update Vercel environment variables (production)
5. Verify application still works
6. Check logs for unauthorized access

---

## LLM-Specific Notes

### For Claude Code

When Claude Code needs to test integrations:
1. Use keys from `.env.testing` only
2. All test transactions should use Stripe test mode
3. Never persist keys in conversation context
4. Summarize results without including key values

### For Gemini

Same rules apply. Gemini should:
1. Read `.shared-memory/context.md` for any key-related context
2. Never request key values directly
3. Assume test environment unless explicitly told otherwise

---

## Emergency Contacts

If keys are exposed:

| Service | Revocation URL |
|---------|---------------|
| Supabase | https://app.supabase.com/project/_/settings/api |
| Stripe | https://dashboard.stripe.com/apikeys |
| Australia Post | Contact developer support |
| Anthropic | https://console.anthropic.com/settings/keys |
| Google AI | https://console.cloud.google.com/apis/credentials |

---

*This document governs all API key handling for ASHIKA. Violations are considered critical security incidents.*
