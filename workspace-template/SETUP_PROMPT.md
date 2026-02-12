# SETUP PROMPT — Restructure Existing Project Into Standard Workspace

Paste this entire file as a prompt into Claude Code or Antigravity when you open an existing project that needs restructuring.

---

## INSTRUCTIONS FOR AGENT

You are restructuring this existing project into a standard workspace layout with memory, skills, and deployment tracking. Follow these phases IN ORDER. Do not skip or combine phases.

### ABSOLUTE RULES

- NEVER modify/move/delete: `.git/`, `.env*`, `.vercel/`, `node_modules/`, lock files
- NEVER push to GitHub or deploy without explicit approval
- NEVER combine file moves with content changes in the same commit
- Use `git mv` for all moves — never plain `mv`
- Verify build passes after every phase

---

## PHASE 0: AUDIT (read only)

```bash
echo "=== Git ===" && git remote get-url origin 2>/dev/null && git branch --show-current
echo "=== Vercel ===" && cat .vercel/project.json 2>/dev/null || echo "No Vercel link"
echo "=== Env ===" && ls -la .env* 2>/dev/null
echo "=== Framework ===" && ls package.json tsconfig.json next.config.* vite.config.* 2>/dev/null
```

If uncommitted changes: `git add -A && git commit -m "checkpoint: pre-restructure"`
Create branch: `git checkout -b refactor/workspace-restructure`
Run `npm run build` — if fails, STOP.
Present summary. **Wait for approval.**

## PHASE 1: CREATE STRUCTURE (no file moves)

Create folders and files that don't exist:
- `memory/` with: context.md, stack.md, decisions.md, lessons.md, deployment.md
- `skills/` with: README.md, _template/SKILL.md
- `api-keys/` with: README.md, registry.md
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- `progress.md`, `prd.md`
- README.md in every new folder

Fill memory files from Phase 0 audit data. Commit: `"chore: add workspace structure"`

## PHASE 2: MOVE FILES (no content changes)

Move existing source files into structure using `git mv`. Commit: `"refactor: move files"`

## PHASE 3: UPDATE REFERENCES

Fix all broken imports, tsconfig paths, bundler config, package.json scripts, framework config. Update all folder READMEs. Commit: `"fix: update paths"`

## PHASE 4: VERIFY

```bash
npx tsc --noEmit && npm run build && npm run test
git remote -v && cat .vercel/project.json 2>/dev/null
```

Fix any failures. Commit fixes.

## PHASE 5: FINALIZE

Update root README, progress.md, memory/decisions.md. Final commit: `"docs: finalize workspace"`

**Do NOT push. Wait for approval.**
