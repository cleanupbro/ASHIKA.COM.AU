# Gemini / Antigravity Instructions

Read `AGENTS.md` first. Follow all rules there.

## On Every Session Start

1. Read every file in `memory/`
2. Read `progress.md`
3. Scan `skills/README.md` for available skills
4. You now have full context. Begin work.

## On Every Session End

1. Update `progress.md` with what was done
2. Append any decisions to `memory/decisions.md`
3. Append any lessons to `memory/lessons.md`
4. Update `memory/stack.md` or `memory/deployment.md` if anything changed

## Working Rules

- Read a folder's `README.md` before touching anything in it
- After creating or deleting any file/folder, update the relevant `README.md`
- When a task matches a skill, load that skill's `SKILL.md` and follow it
- Generate Artifacts (screenshots, plans) for UI changes
- Use `git mv` for file moves — never plain `mv`
- Run build/tests after any structural change
- If uncertain about scope, read `prd.md`
