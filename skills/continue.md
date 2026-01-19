# Continue Session Skill

> Session recovery with visual summary - shows last session state and next steps
> Priority: CRITICAL

---

## Triggers

Say any of these to show session recovery summary:
- "continue"
- "continue project"
- "resume"
- "what's the state"
- "where were we"

---

## What Happens Automatically

```
1. READ MEMORY FILES
   ├── memory/handoff.md → Current state, last action
   └── memory/session-log.md → Recent session history

2. PARSE LAST SESSION
   ├── Extract date/time
   ├── Extract project name
   ├── Extract completed items
   ├── Extract files changed
   └── Extract next steps

3. GENERATE VISUAL SUMMARY
   └── Display ASCII box with session info

4. ASK WHAT'S NEXT
   └── "What would you like to work on?"
```

---

## Visual Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION RECOVERY                          ║
╠══════════════════════════════════════════════════════════════╣
║ Last Session: [Date] @ [Time]                               ║
║ Project: [Project Name]                                      ║
║ Status: [READY FOR NEW WORK / WIP / BLOCKED]                ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLETED:                                                   ║
║ ├── [item 1]                                                ║
║ ├── [item 2]                                                ║
║ └── [item n]                                                ║
╠══════════════════════════════════════════════════════════════╣
║ FILES CHANGED: [count]                                       ║
║ └── [file1], [file2], [file3]                               ║
╠══════════════════════════════════════════════════════════════╣
║ NEXT STEPS:                                                  ║
║ └── [what to do next]                                       ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Steps

### 1. Read Handoff File

```bash
# Read current state
cat memory/handoff.md
```

Extract:
- **Last Updated** timestamp
- **Status** (READY FOR NEW WORK, WIP, BLOCKED)
- **Current Task** (if any)
- **Completed Today** list
- **Next Session** notes

### 2. Read Session Log

```bash
# Read recent history
cat memory/session-log.md
```

Extract from most recent session entry:
- Session start/end times
- LOCKED project
- Action summary
- Completed items

### 3. Identify Files Changed

Check git status for recent changes:

```bash
git status --short
git log --oneline -1 --name-only
```

### 4. Generate Visual Summary

Build the ASCII box output using extracted data:
- Replace `[Date]` with last session date
- Replace `[Time]` with last session time
- Replace `[Project Name]` with locked/active project
- Replace `[Status]` with current status
- List completed items with tree formatting
- Show files changed count and names
- Show next steps from handoff

### 5. Display and Ask

Output the visual summary, then ask:

> "What would you like to work on?"

---

## Example Usage

**User says:** "continue"

**Claude does:**

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION RECOVERY                          ║
╠══════════════════════════════════════════════════════════════╣
║ Last Session: Jan 18, 2026 @ 18:40                          ║
║ Project: EphraimCare                                         ║
║ Status: READY FOR NEW WORK                                   ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLETED:                                                   ║
║ ├── Fixed Vercel deployment (Root Directory config)         ║
║ ├── Fixed ElevenLabs widget (agent ID corrected)            ║
║ ├── Deployed to www.ephraimcare.com.au                      ║
║ └── Created skills/vercel-deploy.md                         ║
╠══════════════════════════════════════════════════════════════╣
║ FILES CHANGED: 4                                             ║
║ └── ElevenLabsWidget.tsx, vercel-deploy.md, session-log.md  ║
╠══════════════════════════════════════════════════════════════╣
║ NEXT STEPS:                                                  ║
║ └── Ready for new work                                       ║
╚══════════════════════════════════════════════════════════════╝

What would you like to work on?
```

---

## Status Indicators

| Status | Meaning |
|--------|---------|
| `READY FOR NEW WORK` | No active task, pick anything |
| `WIP` | Work in progress, consider continuing |
| `BLOCKED` | Something needs resolution first |

---

## Why This Matters

| Problem | Solution |
|---------|----------|
| Forgot what was done last time | Visual summary shows completed work |
| Lost context between sessions | Handoff + session log preserve state |
| Don't know what to do next | Next steps clearly shown |
| Can't find changed files | Files listed with count |

---

## Related Skills

- `done-for-day.md` - End session and save state
- `sync.md` - Sync changes to GitHub
- `backup.md` - Manual backup trigger
