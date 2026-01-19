# Deploy Skill
> Deploy changes to production
> Priority: HIGH

---

## TRIGGERS

- "deploy"
- "push"
- "go live"
- "ship it"
- "make it live"

---

## PRE-FLIGHT CHECKS

1. [ ] Run `npm run build` — must pass with 0 errors
2. [ ] Check for uncommitted changes
3. [ ] Verify on correct branch (main)
4. [ ] Review changes with `git diff`

---

## STEPS

### 1. Build Verification
```bash
cd ~/Desktop/ephraim-care/ephraim-care-app
npm run build
```
Must complete with 0 errors.

### 2. Stage Changes
```bash
cd ~/Desktop/ephraim-care
git add -A
```

### 3. Commit
```bash
git commit -m "feat(vX.X.X): description

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 4. Push
```bash
git push origin main
```

### 5. Verify Deployment
- Wait 1-3 minutes for Vercel build
- Check https://www.ephraimcare.com.au
- Verify changes are live

---

## IF VERCEL AUTO-DEPLOY FAILS

Use API deployment:

```bash
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"name":"ephraim-care-app","project":"prj_NAdt7XKrxBZ5V5o4r9M98pUPAwBJ","target":"production","projectSettings":{"rootDirectory":"ephraim-care-app"},"gitSource":{"type":"github","repoId":1125568259,"ref":"main"}}'
```

Get token from `.secrets/KEYS.md`

---

## VERIFICATION

- [ ] Build passed locally
- [ ] Changes pushed to GitHub
- [ ] Vercel deployment READY
- [ ] Website shows changes
- [ ] MEMORY.md updated

---

## IF FAILED

1. Check build errors: `npm run build`
2. Check git status: `git status`
3. Check Vercel dashboard for deployment errors
4. If needed, rollback: `git revert HEAD`

---

## SUCCESS MESSAGE

"Deployed v[X.X.X] to production. Live at www.ephraimcare.com.au"

---

*For deployment issues, check Vercel dashboard or use API deployment.*
