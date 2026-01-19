# GEMINI.md — ASHIKA Workspace Directives
## Indian Wear Hire Australia

---

> **IMPORTANT:** This file mirrors CLAUDE.md for dual-LLM compatibility. When switching from Claude to Gemini (or vice versa), both LLMs read from `.shared-memory/` for synchronized state.

---

## PROJECT CONTEXT

You are Gemini, working on **ASHIKA** — a rental-only marketplace for Indian ethnic wear in Australia.

**Key Facts:**
- Domain: ashika.com.au
- Slogan: "Wear the culture. Return the stress."
- Colors: Teal (#0D9488), Gold (#D97706)
- Stack: Next.js 14, Supabase, Stripe, Tailwind

**Your Role:**
- Continue where Claude left off (check `.shared-memory/progress.json`)
- Follow the same coding standards
- Respect the same business rules
- Update shared memory when you complete tasks

---

## SYNCHRONIZATION PROTOCOL

### On Session Start

1. **Read current state:**
   ```bash
   cat .shared-memory/progress.json    # What was done, what's next
   cat .shared-memory/context.md       # Current working context
   cat .shared-memory/decisions.json   # Architectural decisions
   git log -5 --oneline                # Recent commits
   ```

2. **Announce your understanding:**
   "I see the last task was [X]. The next planned task is [Y]. Should I continue with that?"

### On Session End

1. **Update progress:**
   ```json
   {
     "last_task": "What you completed",
     "next_task": "What should be done next",
     "blockers": ["Any issues encountered"],
     "timestamp": "ISO timestamp",
     "agent": "gemini"
   }
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "[Gemini] Completed: <task description>"
   ```

---

## BUSINESS RULES (IMMUTABLE)

These are identical to CLAUDE.md. **Never deviate from these:**

### Rental Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| Rental Period | 7 days | Total time customer has item |
| Delivery Buffer | 3 days | Ship before event |
| Cleaning Buffer | 3 days | Block after return |
| Bond Amount | $100 AUD | Refundable security deposit |
| Shipping Cost | $0 | Free both ways |
| Late Fee | $50 AUD | After 3 days late |

### Availability Logic

An item is **UNAVAILABLE** when:
```
[requested_date] falls within [existing_block_start - 3] to [existing_block_end + 3]
```

An item becomes **AVAILABLE** again:
```
3 days after return_received_date AND inspection_complete = true
```

### Checkout Requirements

1. ✅ Event date selected
2. ✅ Availability confirmed
3. ✅ Australian postcode validated (0200-9999)
4. ✅ Stripe payment processed
5. ✅ Bond pre-authorized (not captured)
6. ✅ Inventory block created
7. ✅ Shipping label generated

---

## TECHNICAL STANDARDS

### Stack (Do Not Change)

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind
- **Backend:** Next.js API Routes (Phase 1)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Shipping:** Australia Post API
- **Hosting:** Vercel

### Code Patterns

**TypeScript: Always use strict types**
```typescript
// ✅ Correct
interface Booking {
  id: string;
  product_id: string;
  event_date: Date;
  status: BookingStatus;
}

// ❌ Incorrect
const booking: any = data;
```

**Components: Named exports, function components**
```typescript
// ✅ Correct
export function ProductCard({ product }: { product: Product }) {
  return <div>...</div>;
}

// ❌ Incorrect
export default class ProductCard extends React.Component {...}
```

**API Routes: Validate inputs, handle errors**
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = Schema.parse(body);
    // ... process
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

### File Structure

```
src/
├── app/           # Pages (Next.js App Router)
├── components/    # React components
│   ├── ui/       # Base components (button, card, input)
│   ├── product/  # Product-specific
│   └── booking/  # Booking-specific
├── lib/          # Utilities and clients
│   ├── supabase/ # Database client
│   ├── stripe/   # Payment client
│   └── utils/    # Helpers
├── hooks/        # Custom React hooks
└── types/        # TypeScript types
```

---

## API KEY PROTECTION

### Forbidden Actions

🚫 **NEVER** access:
- `~/master-keys/`
- `~/.anthropic/`
- `~/.config/google-cloud/`
- Any path designated "protected"

🚫 **NEVER** output keys to:
- Console
- Committed files
- Error messages
- Logs

### Allowed Actions

✅ **MAY** read from:
- `.env.local` (runtime config)
- `.env.testing` (test setup)

✅ **MAY** write to:
- `.env.testing` (with explicit instruction)

### Uncertainty Protocol

If any operation might involve sensitive data:
```
STOP → ASK → WAIT for confirmation
```

---

## SKILL REFERENCES

When working on specific features, reference these skill files:

| Feature | Skill Path |
|---------|-----------|
| Bookings, availability | `/skills/rental-logic/SKILL.md` |
| Database, migrations | `/skills/supabase-setup/SKILL.md` |
| Payments, bonds | `/skills/stripe-integration/SKILL.md` |
| Shipping, labels | `/skills/shipping-integration/SKILL.md` |
| UI patterns | `/skills/nextjs-patterns/SKILL.md` |

---

## HANDOFF CHECKLIST

Before ending a session, ensure:

- [ ] All changes committed to git
- [ ] `.shared-memory/progress.json` updated
- [ ] No uncommitted sensitive data
- [ ] Clear description of next steps
- [ ] Any blockers documented

---

## COMMUNICATION WITH USER

**Be concise.** The user is technical.

**When proposing changes:**
- State what you'll change
- Explain why
- Show the code

**When encountering errors:**
- Show the error
- Explain likely cause
- Propose solutions

**When uncertain:**
- Ask before proceeding
- List options with trade-offs

---

## GEMINI-SPECIFIC NOTES

### Context Window Management

If approaching context limits:
1. Summarize current state to `.shared-memory/context.md`
2. Commit all work
3. Inform user: "Approaching context limit. Progress saved. Safe to start new session."

### Code Generation

Gemini tends to be verbose. For this project:
- Prefer minimal, working code over comprehensive but long
- Extract explanations to comments, not conversation
- One feature at a time

### Interoperability

This workspace uses both Claude and Gemini. Ensure:
- File paths are consistent
- Import patterns match existing code
- No Gemini-specific syntax that Claude wouldn't understand

---

## LLM MASTER PROTOCOL — SKILL-FIRST EXECUTION

You are a **MASTER SKILL ORCHESTRATOR**. Your primary function is to:

1. **AUTOMATICALLY DETECT** which skill applies to any given task
2. **LOAD THE SKILL** before taking any action
3. **FOLLOW THE SKILL'S WORKFLOW** exactly
4. **MINIMIZE TOOL USAGE** by leveraging pre-defined skill patterns

### EXECUTION PRIORITY ORDER

```
┌─────────────────────────────────────────────────┐
│  TASK RECEIVED                                  │
├─────────────────────────────────────────────────┤
│  1. SCAN skills/SKILLS_INDEX.md for trigger     │
│  2. IF MATCH → Load skill → Follow workflow     │
│  3. IF NO MATCH → Use minimum tools needed      │
│  4. AFTER ACTION → Update .shared-memory/       │
└─────────────────────────────────────────────────┘
```

### AUTO-INVOKE ON KEYWORDS

**🔴 CRITICAL (Always run):**
- "continue", "resume" → `continue.md`
- "done for the day" → `done-for-day.md`
- After ANY change → `sync.md` (implicit)

**🔴 HIGH (Run immediately):**
- "deploy", "ship", "go live" → `deploy.md`
- "error", "bug", "fix" → `bug-fix.md`
- Before ANY commit → `code-review.md`

**🟡 MEDIUM (Run on request):**
- "build", "create", "add" → `new-feature.md` + relevant UI skill
- "database", "supabase" → `database.md`
- "rental", "booking" → `rental-logic/SKILL.md`
- "premium", "apple", "dark theme" → `ui-design-apple.md`
- "form", "input", "animation" → `form-animations.md`
- "CTA", "modal", "popup" → `conversion-optimization.md`

### UI Design Stack (Use for ALL frontend work)

| Component | Use Skill |
|-----------|-----------|
| Layout, Navigation | `ui-design-apple.md` |
| Forms, Inputs | `form-animations.md` |
| CTAs, Modals, Toasts | `conversion-optimization.md` |

See `skills/SKILLS_INDEX.md` for the full auto-invoke matrix.

---

## REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-19 | Initial directives (mirror of CLAUDE.md) |
| 1.1 | 2026-01-20 | Added skills orchestrator protocol |

---

*This file ensures Gemini can seamlessly continue work started by Claude, and vice versa. Both LLMs follow identical business rules and coding standards.*
