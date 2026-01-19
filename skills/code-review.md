# Code Review Skill
> Review code quality before commits
> Priority: HIGH — Runs IMPLICITLY before every commit

---

## TRIGGERS

- Before ANY git commit (automatic)
- "review code"
- "check my code"
- "code quality"

**This skill runs IMPLICITLY before every commit.**

---

## PRE-FLIGHT CHECKS

1. [ ] Identify files to be committed
2. [ ] Check for uncommitted changes
3. [ ] Verify build passes

---

## STEPS

### 1. Identify Changes
```bash
git status
git diff --staged
git diff
```

### 2. Build Check
```bash
cd ~/Desktop/ephraim-care/ephraim-care-app
npm run build
```
**MUST pass before proceeding.**

### 3. Review Checklist

#### TypeScript Quality
- [ ] No `any` types (unless absolutely necessary)
- [ ] Proper interface/type definitions
- [ ] No unused variables or imports

#### React/Next.js Quality
- [ ] Components properly typed
- [ ] useEffect dependencies correct
- [ ] No console.log statements left in
- [ ] Proper error boundaries where needed

#### Styling Quality
- [ ] Using Tailwind classes (not inline styles)
- [ ] Responsive design (mobile-first)
- [ ] Consistent spacing and colors

#### NDIS Compliance
- [ ] No medical/clinical terminology
- [ ] Uses "participant" not "patient"
- [ ] Accurate service descriptions

#### Security
- [ ] No hardcoded API keys
- [ ] No sensitive data in code
- [ ] Proper input validation

### 4. Review Decision

**PASS** — Ready to commit if:
- Build passes
- No critical issues found
- Code follows existing patterns

**FAIL** — Fix before commit if:
- Build fails
- TypeScript errors
- Security issues
- NDIS compliance violations

---

## QUICK REVIEW COMMANDS

```bash
# Check for console.log
grep -r "console.log" ephraim-care-app/src/

# Check for any types
grep -r ": any" ephraim-care-app/src/

# Check for TODO comments
grep -r "TODO" ephraim-care-app/src/

# Run TypeScript check
cd ephraim-care-app && npx tsc --noEmit
```

---

## VERIFICATION

- [ ] Build passes with 0 errors
- [ ] No TypeScript errors
- [ ] No console.log statements
- [ ] NDIS compliant language
- [ ] No hardcoded secrets

---

## IF FAILED

1. List specific issues found
2. Suggest fixes for each issue
3. Do NOT proceed with commit until fixed
4. Re-run review after fixes

---

## SUCCESS MESSAGE

"Code review passed. Ready to commit."

---

*After passing review, proceed with git commit.*
