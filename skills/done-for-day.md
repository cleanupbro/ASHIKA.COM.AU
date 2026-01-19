# Done For The Day Skill

> End-of-session backup routine - saves everything to GitHub
> Priority: CRITICAL

---

## Triggers

Say any of these to run the full backup routine:
- "done for the day"
- "done for today"
- "save everything"
- "end session"

---

## What Happens Automatically

```
1. GENERATE SESSION SUMMARY
   └── Display visual summary box (before anything else)

2. UPDATE WORKSPACE FILES
   ├── memory/handoff.md → Session summary, files changed
   ├── memory/session-log.md → Session entry
   └── CLIENT_SUMMARY.md → If client work was done

3. STAGE ALL CHANGES
   └── git add -A

4. COMMIT WITH SESSION SUMMARY
   └── git commit -m "session(YYYY-MM-DD): [summary of work done]"

5. PUSH TO GITHUB
   └── git push origin main

6. CONFIRM BACKUP
   └── "Session saved to GitHub. Commit: [hash]"
```

---

## Visual Session Summary

**Display this FIRST before any git operations:**

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION SUMMARY                           ║
╠══════════════════════════════════════════════════════════════╣
║ Duration: ~[X] hours                                         ║
║ Project: [Project Name]                                      ║
╠══════════════════════════════════════════════════════════════╣
║ WHAT WE DID:                                                 ║
║ ├── 1. [action 1]                                           ║
║ ├── 2. [action 2]                                           ║
║ ├── 3. [action 3]                                           ║
║ └── 4. [action n]                                           ║
╠══════════════════════════════════════════════════════════════╣
║ FILES MODIFIED: [count]                                      ║
║ ├── [file 1]                                                ║
║ ├── [file 2]                                                ║
║ └── [file n] (NEW)                                          ║
╚══════════════════════════════════════════════════════════════╝

Saving to GitHub...
```

### How to Build the Summary

1. **Duration:** Calculate from session start time in session-log.md
2. **Project:** Use the LOCKED project from session-log.md
3. **What We Did:** List actions from this session (track as you work)
4. **Files Modified:** Run `git status --short` and count/list files
   - Mark new files with `(NEW)`

---

## Steps

### 1. Update Memory Files

Update MEMORY.md with:
- **Date:** [today's date]
- **Action:** [summary of session work]
- **Files:** [list of modified files]
- **State:** [build status]
- **Next:** [what to do next session]

### 2. Update Handoff

Update HANDOFF.md with:
- Session number (increment)
- What was done this session
- Files modified
- Context for next AI

### 3. Check for Uncommitted Changes

```bash
git status
```

If changes exist, proceed. If no changes, report "No changes to commit."

### 4. Stage All Changes

```bash
git add -A
```

### 5. Create Session Commit

```bash
git commit -m "$(cat <<'EOF'
session(YYYY-MM-DD): [session summary]

Changes:
- [bullet point changes]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 6. Push to GitHub

```bash
git push origin main
```

### 7. Confirm Backup

Report to user:
- Commit hash
- Number of files changed
- GitHub is now synced

---

## Success Message

```
Session saved to GitHub
Commit: [hash]
Files backed up: [count]
GitHub synced. Safe to close.
```

---

## Why This Matters

| Problem | Solution |
|---------|----------|
| Forgot to commit changes | Auto-commits on "done for the day" |
| Lost work between sessions | Everything pushed to GitHub |
| Context lost for next session | MEMORY.md and HANDOFF.md updated |
| No record of what was done | Commit message documents session |

---

## Example Usage

**User says:** "done for the day"

**Claude displays:**

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION SUMMARY                           ║
╠══════════════════════════════════════════════════════════════╣
║ Duration: ~2 hours                                           ║
║ Project: EphraimCare                                         ║
╠══════════════════════════════════════════════════════════════╣
║ WHAT WE DID:                                                 ║
║ ├── 1. Fixed Vercel Root Directory config                   ║
║ ├── 2. Corrected ElevenLabs agent ID                        ║
║ ├── 3. Deployed to www.ephraimcare.com.au                   ║
║ └── 4. Created vercel-deploy.md skill                       ║
╠══════════════════════════════════════════════════════════════╣
║ FILES MODIFIED: 4                                            ║
║ ├── ElevenLabsWidget.tsx                                    ║
║ ├── skills/vercel-deploy.md (NEW)                           ║
║ ├── memory/session-log.md                                   ║
║ └── memory/handoff.md                                       ║
╚══════════════════════════════════════════════════════════════╝

Saving to GitHub...
```

**Then Claude does:**
1. Updates memory/handoff.md with session summary
2. Updates memory/session-log.md with session entry
3. Runs `git add -A`
4. Commits: `session(2026-01-18): EphraimCare deployment + ElevenLabs widget fix`
5. Pushes to origin main
6. Reports: "Session saved. Commit abc1234. 4 files backed up."

---

## Related Skills

- `backup.md` - Manual backup trigger
- `sync.md` - Sync between local and GitHub
- `deploy.md` - Deploy to Vercel
