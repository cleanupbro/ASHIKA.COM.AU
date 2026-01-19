# Auto-Sync Skill
> Ensures workspace state is always saved for session continuity
> Priority: CRITICAL — Runs after EVERY action

---

## TRIGGERS

- After ANY file change
- After ANY code modification
- After ANY conversation turn
- Before closing/exiting session
- After every commit

**This skill is IMPLICIT — runs automatically without being asked.**

---

## PRE-FLIGHT CHECKS

1. Verify MEMORY.md exists
2. Verify HANDOFF.md exists
3. Check for uncommitted changes

---

## STEPS

### 1. Update MEMORY.md

Add/update the "Last Update" section:

```markdown
## Last Update
- Date: [current timestamp]
- Action: [what was done]
- Files: [files modified]
- State: [build status]
- Next: [what to do next]
```

### 2. Update HANDOFF.md (if significant work done)

Update these sections:
- "Last Session Summary"
- "Current State"
- "Files Modified"
- "Context for Next AI"

### 3. Update CLIENT_SUMMARY.md (if client-facing work)

- Add entry to Change History table
- Update version if deployed
- Update capabilities if features added

### 4. Check Git Status

- Are there uncommitted changes?
- Should they be committed now?

---

## VERIFICATION

- [ ] MEMORY.md has current timestamp
- [ ] HANDOFF.md reflects current state
- [ ] CLIENT_SUMMARY.md is current (if applicable)
- [ ] No critical uncommitted changes

---

## IF FAILED

1. Warn user about unsaved state
2. Attempt manual save to MEMORY.md
3. Suggest committing changes

---

## SUCCESS MESSAGE

"State synced to MEMORY.md"

(Usually silent — only mention if specifically asked)

---

## EMERGENCY RECOVERY

If session ended abruptly, on next start:
1. Read MEMORY.md first
2. Read HANDOFF.md second
3. Check `git status` for uncommitted work
4. Resume from "Next" field in MEMORY.md

---

*This skill ensures continuity across sessions and AI switches.*
