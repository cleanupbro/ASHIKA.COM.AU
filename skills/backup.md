# Backup Skill
> Save workspace state and create recovery points
> Priority: LOW

---

## TRIGGERS

- "backup"
- "save state"
- "snapshot"
- "save progress"
- "checkpoint"

---

## PRE-FLIGHT CHECKS

1. [ ] Check for uncommitted changes
2. [ ] Verify build passes
3. [ ] Identify what needs backing up

---

## STEPS

### 1. Check Current State
```bash
cd ~/Desktop/ephraim-care
git status
```

### 2. Commit Current Work
```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "backup: save current state [date]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# Push to remote
git push origin main
```

### 3. Update Memory Files
Ensure these files are current:
- MEMORY.md — Current workspace state
- HANDOFF.md — Session context
- CLIENT_SUMMARY.md — Client-facing status

### 4. Create Tagged Release (Optional)
For major milestones:
```bash
git tag -a v2.3.1 -m "Backup before major change"
git push origin v2.3.1
```

### 5. Verify Backup
```bash
# Check remote is synced
git log origin/main --oneline -5

# Verify no uncommitted changes
git status
```

---

## BACKUP TYPES

### Quick Backup (Git Commit)
- Commits current changes
- Pushes to remote
- Takes 1-2 minutes

### Full Backup (Memory + Commit)
- Updates all memory files
- Commits everything
- Creates tagged version
- Takes 5-10 minutes

### Emergency Backup
When something might break:
```bash
# Create safety branch
git checkout -b backup-$(date +%Y%m%d-%H%M%S)
git add -A
git commit -m "emergency backup"
git checkout main
```

---

## WHAT GETS BACKED UP

| Item | Location | Method |
|------|----------|--------|
| Source code | Git repository | git push |
| Memory state | MEMORY.md | File update |
| Session context | HANDOFF.md | File update |
| Client summary | CLIENT_SUMMARY.md | File update |

---

## WHAT DOES NOT GET BACKED UP

- `.secrets/` folder (gitignored)
- `node_modules/` (gitignored)
- `.next/` build cache (gitignored)

**Note:** API keys must be stored separately and are NOT in git.

---

## RECOVERY FROM BACKUP

### Restore from Commit
```bash
# View commit history
git log --oneline -20

# Restore specific file from commit
git checkout [commit-hash] -- [file-path]

# Restore entire commit
git checkout [commit-hash]
```

### Restore from Tag
```bash
# List tags
git tag -l

# Checkout tag
git checkout v2.3.0
```

---

## VERIFICATION

- [ ] Git status shows clean working tree
- [ ] Remote is synced with local
- [ ] MEMORY.md has current timestamp
- [ ] HANDOFF.md is up to date

---

## IF FAILED

1. Check for merge conflicts
2. Resolve any git issues
3. Force push if necessary (with caution):
   ```bash
   git push --force origin main
   ```

---

## SUCCESS MESSAGE

"Backup complete. Committed as [commit-hash]. Remote synced."

---

*Regular backups prevent work loss. Commit often.*
