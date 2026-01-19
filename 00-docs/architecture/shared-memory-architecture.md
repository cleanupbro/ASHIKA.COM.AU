# Shared Memory Architecture
## Claude ↔ Gemini Synchronization

---

## Purpose

This document defines how Claude and Gemini share state, ensuring seamless handoff between LLMs.

---

## Directory Structure

```
ashika/
├── .shared-memory/           # Both LLMs read/write here
│   ├── progress.json        # Current task state
│   ├── context.md           # Active working context
│   └── decisions.json       # Architectural decisions log
```

---

## File Specifications

### progress.json

```json
{
  "current_phase": "Phase 1: MVP",
  "current_week": 3,
  "last_task": {
    "description": "Completed product grid component",
    "files_modified": [
      "src/components/product/product-grid.tsx",
      "src/app/shop/page.tsx"
    ],
    "completed_at": "2026-01-19T14:30:00Z",
    "completed_by": "claude"
  },
  "next_task": {
    "description": "Implement filter sidebar",
    "reference": "execution-plan.md#week-3-4",
    "dependencies": ["Product grid must be complete"]
  },
  "blockers": [],
  "notes": "Filter state should use URL params for shareability"
}
```

**Update Rules:**
- Update `last_task` when completing any task
- Update `next_task` based on execution plan
- Add to `blockers` if something prevents progress
- Clear `blockers` when resolved

### context.md

```markdown
# Current Working Context

## Active Focus
Building the product filtering system for the catalog page.

## Key Files
- `src/app/shop/page.tsx` - Main catalog page
- `src/components/product/product-filters.tsx` - Filter sidebar (in progress)
- `src/hooks/use-product-filters.ts` - Filter state management

## Recent Decisions
- Using URL search params for filter state (not React state)
- Filters: category, size, blouse_included, price_range
- Price ranges: <$50, $50-100, $100-150, $150-200, >$200

## Open Questions
None currently.

## Notes for Next Session
The filter component skeleton is complete. Next: connect to Supabase query.
```

**Update Rules:**
- Overwrite entirely at session end
- Focus on what the NEXT session needs to know
- Be specific about file paths and decisions

### decisions.json

```json
{
  "decisions": [
    {
      "id": "DEC-001",
      "date": "2026-01-19",
      "topic": "Filter State Management",
      "decision": "Use URL search params instead of React state",
      "rationale": "Enables shareable URLs, browser back/forward, and SSR compatibility",
      "alternatives_considered": [
        "React useState (rejected: not shareable)",
        "Redux (rejected: overkill for this use case)",
        "Zustand (rejected: unnecessary dependency)"
      ],
      "decided_by": "claude"
    },
    {
      "id": "DEC-002",
      "date": "2026-01-19",
      "topic": "Price Range Filters",
      "decision": "Use predefined ranges instead of min/max slider",
      "rationale": "Simpler UX, fewer edge cases, matches competitor patterns",
      "alternatives_considered": [
        "Min/max input fields (rejected: validation complexity)",
        "Dual-thumb slider (rejected: accessibility concerns)"
      ],
      "decided_by": "claude"
    }
  ]
}
```

**Update Rules:**
- Append new decisions (never remove)
- Include rationale for every decision
- List alternatives that were considered
- Note who made the decision (claude/gemini/human)

---

## Synchronization Protocol

### When Starting a Session

```
1. Read progress.json
   → Understand what was last done
   → Identify next task

2. Read context.md
   → Get detailed context for current work
   → Note any open questions

3. Read decisions.json
   → Understand past architectural decisions
   → Avoid re-debating settled issues

4. Check git log
   → See recent commits
   → Verify code matches documented state
```

### When Ending a Session

```
1. Commit all code changes
   git add .
   git commit -m "[Claude/Gemini] Completed: <task description>"

2. Update progress.json
   → Set last_task to what was completed
   → Set next_task to what should be done next
   → Update blockers if any

3. Update context.md
   → Document current working context
   → Note any decisions made
   → Leave notes for next session

4. Update decisions.json (if applicable)
   → Add any new architectural decisions

5. Final commit
   git add .shared-memory/
   git commit -m "Updated shared memory"
```

### On LLM Switch (Claude → Gemini or vice versa)

```
1. Outgoing LLM: Complete session end protocol
2. Human: Start new session with incoming LLM
3. Incoming LLM: Complete session start protocol
4. Incoming LLM: Announce understanding
   "I see the last task was [X] completed by [claude/gemini].
    The next task is [Y]. Shall I continue?"
```

---

## Conflict Resolution

If progress.json conflicts with git state:
```
Git state wins. Update progress.json to match reality.
```

If context.md is outdated:
```
Read the actual files. Update context.md.
```

If decisions.json has conflicting entries:
```
Ask the user to clarify. Document the resolution.
```

---

## Templates

### Starting a New Week

Update progress.json:
```json
{
  "current_week": 4,
  "last_task": { ... },
  "next_task": {
    "description": "Begin Week 4 tasks",
    "reference": "execution-plan.md#week-3-4"
  }
}
```

### Documenting a Blocker

Update progress.json:
```json
{
  "blockers": [
    {
      "issue": "Supabase API key not working",
      "since": "2026-01-20T10:00:00Z",
      "attempted_solutions": [
        "Verified key in dashboard",
        "Checked environment variable loading"
      ],
      "needs": "Human to verify Supabase project settings"
    }
  ]
}
```

### Making a Decision

Add to decisions.json:
```json
{
  "id": "DEC-003",
  "date": "2026-01-20",
  "topic": "Image Storage",
  "decision": "Use Supabase Storage instead of Cloudinary",
  "rationale": "Free tier is sufficient, simpler integration, one less service",
  "alternatives_considered": ["Cloudinary", "AWS S3", "Vercel Blob"],
  "decided_by": "gemini"
}
```

---

## Best Practices

1. **Be specific** — Include file paths, function names, line numbers
2. **Be concise** — Next session should understand in < 2 minutes
3. **Be honest** — Document what actually happened, not what should have
4. **Be forward-looking** — Focus on what needs to happen next
5. **Commit often** — Git is the ultimate source of truth

---

*This system ensures continuity regardless of which LLM is active. Both Claude and Gemini must follow this protocol.*
