# Documentation Skill
> Update and maintain documentation
> Priority: LOW

---

## TRIGGERS

- "document"
- "readme"
- "explain"
- "update docs"
- "write documentation"

---

## PRE-FLIGHT CHECKS

1. [ ] Identify what needs documenting
2. [ ] Determine audience (developer vs client)
3. [ ] Find existing documentation to update

---

## DOCUMENTATION HIERARCHY

```
ephraim-care/
├── MEMORY.md .............. AI workspace memory
├── HANDOFF.md ............. Session continuity
├── CLIENT_SUMMARY.md ...... Client-facing summary
├── TASKS.md ............... Work queue
├── AI_CONFIG/ ............. AI configuration
│   ├── UNIVERSAL.md ....... Shared context
│   ├── CLAUDE.md .......... Claude-specific
│   └── GEMINI.md .......... Gemini-specific
└── skills/ ................ Workflow documentation
```

---

## STEPS

### 1. Identify Documentation Type

| Audience | Document | Purpose |
|----------|----------|---------|
| AI | MEMORY.md | Workspace state |
| AI | HANDOFF.md | Session continuity |
| Developer | AI_CONFIG/*.md | Technical context |
| Client | CLIENT_SUMMARY.md | Non-technical summary |

### 2. Update Appropriate File

#### For AI Memory Updates
Update MEMORY.md with:
- Current state
- Recent actions
- Known issues
- Next steps

#### For Session Handoff
Update HANDOFF.md with:
- What was done this session
- Current state
- Files modified
- Context for next AI

#### For Client Communication
Update CLIENT_SUMMARY.md with:
- Feature descriptions
- Change history
- Current capabilities

### 3. Follow Formatting Standards

```markdown
# Heading 1 - Document title
## Heading 2 - Main sections
### Heading 3 - Subsections

- Bullet points for lists
1. Numbered lists for steps

| Column | Column |
|--------|--------|
| Data   | Data   |

`code` for inline code
```
Code blocks for multi-line
```
```

### 4. Keep Documentation DRY
- Don't repeat information across files
- Reference other files instead of copying
- Single source of truth for each type of info

---

## DOCUMENTATION TEMPLATES

### Feature Documentation
```markdown
## [Feature Name]

### Purpose
[What it does]

### Usage
[How to use it]

### Location
[Where in codebase]
```

### Change Log Entry
```markdown
| Date | Change | Version |
|------|--------|---------|
| Jan 16, 2026 | [Description] | vX.X.X |
```

### Issue Documentation
```markdown
## Issue: [Title]
- **Symptom:** [What user sees]
- **Cause:** [Root cause]
- **Fix:** [Solution applied]
- **Files:** [Files modified]
```

---

## VERIFICATION

- [ ] Documentation is accurate
- [ ] Formatting is consistent
- [ ] No outdated information
- [ ] Audience-appropriate language

---

## IF FAILED

1. Review existing documentation
2. Check for conflicts with other docs
3. Simplify language
4. Add examples if unclear

---

## SUCCESS MESSAGE

"Documentation updated: [File name]."

---

*Documentation should be updated after every significant change.*
