# Testing Skill
> Verify functionality and quality
> Priority: LOW

---

## TRIGGERS

- "test"
- "verify"
- "check if"
- "make sure"
- "does it work"
- "QA"

---

## PRE-FLIGHT CHECKS

1. [ ] Identify what needs testing
2. [ ] Determine test type (build, visual, functional)
3. [ ] Ensure development server available

---

## STEPS

### 1. Build Test (Always First)
```bash
cd ~/Desktop/ephraim-care/ephraim-care-app
npm run build
```
**MUST pass before any other testing.**

### 2. Development Server Test
```bash
npm run dev
```
Open http://localhost:3000 in browser.

### 3. Visual Testing Checklist

#### Desktop View (1920px)
- [ ] Header displays correctly
- [ ] Navigation works
- [ ] All sections visible
- [ ] Images load
- [ ] Buttons clickable

#### Tablet View (768px)
- [ ] Layout adjusts properly
- [ ] Menu collapses to hamburger
- [ ] Touch targets adequate size

#### Mobile View (375px)
- [ ] Content readable
- [ ] No horizontal scroll
- [ ] Forms usable
- [ ] CTAs visible

### 4. Functional Testing

#### Navigation
- [ ] All links work
- [ ] No 404 errors
- [ ] Back button works

#### Forms (if applicable)
- [ ] Validation works
- [ ] Submit button functions
- [ ] Error messages display
- [ ] Success confirmation shown

#### Performance
- [ ] Pages load in <3 seconds
- [ ] Images optimized
- [ ] No console errors

---

## QUICK TEST COMMANDS

```bash
# Build test
npm run build

# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint

# Start dev server
npm run dev
```

---

## BROWSER TESTING

Test in order of priority:
1. Chrome (desktop + mobile)
2. Safari (important for iOS)
3. Firefox
4. Edge

---

## PRODUCTION TESTING

After deployment, verify at:
- https://www.ephraimcare.com.au
- https://ephraimcare.com.au (redirect)

Check:
- [ ] SSL certificate valid
- [ ] All pages load
- [ ] Images display
- [ ] Forms submit
- [ ] Mobile view works

---

## VERIFICATION

- [ ] Build passes
- [ ] Development server runs
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Forms functional (if any)

---

## IF FAILED

1. Note specific failure
2. Check console for errors
3. Check network tab for failed requests
4. Review recent changes

---

## SUCCESS MESSAGE

"Testing complete: All checks passed."

---

*Report any issues found for bug-fix.md workflow.*
