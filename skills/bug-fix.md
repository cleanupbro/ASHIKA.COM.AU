# Bug Fix Skill
> Debug and fix issues in the application
> Priority: HIGH

---

## TRIGGERS

- "error"
- "bug"
- "not working"
- "broken"
- "fix"
- "crash"
- "undefined"
- "null"

---

## PRE-FLIGHT CHECKS

1. [ ] Reproduce the issue
2. [ ] Identify error message or behavior
3. [ ] Check if issue is in production or development only
4. [ ] Review recent changes that might have caused it

---

## STEPS

### 1. Gather Information
- What is the expected behavior?
- What is the actual behavior?
- When did it start happening?
- What was the last change made?

### 2. Reproduce the Issue
```bash
cd ~/Desktop/ephraim-care/ephraim-care-app
npm run dev
```
Try to trigger the bug in development.

### 3. Check Build for Errors
```bash
npm run build
```
Review any TypeScript or compilation errors.

### 4. Identify Root Cause
Common areas to check:
- Recent git commits: `git log --oneline -10`
- Changed files: `git diff HEAD~5`
- TypeScript errors
- Import/export issues
- Missing dependencies

### 5. Implement Fix
- Make minimal changes to fix the issue
- Don't refactor unrelated code
- Test fix locally

### 6. Verify Fix
```bash
npm run build  # Must pass
npm run dev    # Test the feature
```

### 7. Document Fix
Add to MEMORY.md:
```markdown
## Bug Fix - [Date]
- Issue: [description]
- Root cause: [explanation]
- Fix: [what was done]
- Files changed: [list]
```

---

## DEBUGGING TOOLS

### Check Console Errors
```bash
# In development, check browser console
# Look for red errors or warnings
```

### Check TypeScript
```bash
npx tsc --noEmit
```

### Check Build Output
```bash
npm run build 2>&1 | head -100
```

---

## COMMON ISSUES

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| Module not found | Wrong import path | Check path alias @/ |
| Type error | TypeScript mismatch | Check types/interfaces |
| Hydration error | Server/client mismatch | Check useEffect/useState |
| 404 page | Wrong route | Check page.tsx location |
| Build failed | Syntax error | Check ESLint output |

---

## VERIFICATION

- [ ] Issue is resolved
- [ ] Build passes
- [ ] No new errors introduced
- [ ] Related features still work
- [ ] MEMORY.md updated

---

## IF FAILED

1. Revert changes: `git checkout -- [file]`
2. Check git history for when issue started
3. Consider reverting recent commits
4. Ask for more context about the issue

---

## EMERGENCY ROLLBACK

If fix causes more issues:
```bash
git revert HEAD
git push origin main
```

---

## SUCCESS MESSAGE

"Bug fixed: [Description]. Build passes. Ready for deploy."

---

*For deployment after fix, use deploy.md skill.*
