# [PROJECT_NAME]

> [One line — what this project does]

## Quick Look

| File | What It Is |
|------|-----------|
| `progress.md` | Live status board — what's done, what's next, what's blocked |
| `prd.md` | Locked scope — what we're building and in what order |
| `AGENTS.md` | Rules for all AI agents working on this project |
| `CLAUDE.md` | Claude Code specific instructions |
| `GEMINI.md` | Antigravity specific instructions |
| `.env.example` | Template for environment variables |
| `.gitignore` | Files excluded from Git |

## Folders

| Folder | What's Inside |
|--------|--------------|
| `memory/` | Persistent context — survives between sessions (project identity, decisions, lessons, stack, deployment links) |
| `skills/` | Agent skills library — modular SKILL.md files agents load dynamically for specialized tasks |
| `api-keys/` | API key registry — documents what keys are needed, where to get them (never actual values) |
| `src/` | All source code |
| `tests/` | All tests (mirrors `src/` structure) |
| `docs/` | Documentation and architecture decision records |
| `scripts/` | Deploy, seed, and utility scripts |
| `public/` | Static assets served as-is |

## How Memory Works

The `memory/` folder is this project's brain. Every agent reads it on session start.

| File | Purpose |
|------|---------|
| `context.md` | What this project is and why it exists |
| `stack.md` | Exact tech stack, versions, APIs |
| `decisions.md` | Every major choice made, with date and reasoning |
| `lessons.md` | What went wrong, what worked, what to avoid |
| `deployment.md` | GitHub repo, Vercel project, live URLs |

## How Skills Work

The `skills/` folder teaches agents specialized tasks. Each skill has a `SKILL.md` with instructions.

Agents scan skill descriptions → load matching skill → follow its workflow.

20 built-in skills included. Install 700+ more: `npx antigravity-awesome-skills`

## Setup

```bash
git clone [REPO_URL]
cd [PROJECT_NAME]
cp .env.example .env
# Fill in values from api-keys/registry.md
npm install
npm run dev
```
