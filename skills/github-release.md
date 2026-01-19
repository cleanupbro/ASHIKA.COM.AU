# GitHub Release Skill

> Create GitHub releases via API for version tagging
> Priority: Medium

---

## Triggers

- "create release"
- "make a release"
- "publish release"
- "release version"
- "tag release"

---

## Prerequisites

1. Git tag must exist for the version
2. GitHub PAT token available in `.secrets/API_KEYS.md`
3. Tag must be pushed to GitHub (`git push origin --tags`)

---

## Steps

### 1. Verify Tag Exists

```bash
git tag -l | grep v[VERSION]
```

### 2. Get GitHub Token

Located at: `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md`

```
GITHUB_PAT=ghp_xxxxxxxxxxxxx
```

### 3. Create Release via API

```bash
curl -s -X POST \
  -H "Authorization: token [GITHUB_PAT]" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/[OWNER]/[REPO]/releases \
  -d '{
    "tag_name": "v[VERSION]",
    "name": "v[VERSION] - [TITLE]",
    "body": "[RELEASE_NOTES_MARKDOWN]",
    "draft": false,
    "prerelease": false
  }'
```

### 4. Verify Success

Response includes `"html_url"` with the release link.

---

## Release Notes Template

```markdown
## What's Changed

### Added
- [New features]

### Changed
- [Modifications]

### Fixed
- [Bug fixes]

---

**Live Site:** https://www.ephraimcare.com.au
```

---

## Example: Full Release Command

```bash
curl -s -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/cleanupbro/ephraimcarerepo1/releases \
  -d '{
    "tag_name": "v2.4.0",
    "name": "v2.4.0 - New Feature Name",
    "body": "## What'\''s Changed\n\n### Added\n- Feature 1\n- Feature 2\n\n### Fixed\n- Bug fix 1\n\n---\n\n**Live Site:** https://www.ephraimcare.com.au",
    "draft": false,
    "prerelease": false
  }'
```

---

## Quick Reference

| Repository | API Endpoint |
|------------|--------------|
| Ephraim Care | `https://api.github.com/repos/cleanupbro/ephraimcarerepo1/releases` |
| OpBros | `https://api.github.com/repos/cleanupbro/opbros.automation1/releases` |

---

## Creating Multiple Releases

For batch release creation (e.g., historical versions):

1. Create all tags first:
   ```bash
   git tag -a v1.0.0 [COMMIT_HASH] -m "Version 1.0.0"
   git tag -a v1.1.0 [COMMIT_HASH] -m "Version 1.1.0"
   ```

2. Push all tags:
   ```bash
   git push origin --tags
   ```

3. Create releases via API for each tag

---

## Escape Characters

When using JSON in bash, escape:
- Single quotes: `'\''` (end quote, escaped quote, start quote)
- Newlines in body: `\n`
- Double quotes inside JSON: `\"`

---

## Success Response

```json
{
  "html_url": "https://github.com/[OWNER]/[REPO]/releases/tag/v[VERSION]",
  "tag_name": "v[VERSION]",
  "name": "v[VERSION] - [TITLE]",
  "published_at": "2026-01-16T06:10:15Z"
}
```

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Bad token | Check GITHUB_PAT |
| 404 Not Found | Wrong repo/tag | Verify repo name and tag exists |
| 422 Unprocessable | Tag doesn't exist | Push tag first: `git push origin --tags` |

---

## Related Skills

- `deploy.md` - Deploy to Vercel
- `done-for-day.md` - End of session backup
- `sync.md` - Sync to GitHub

---

*View releases: https://github.com/cleanupbro/ephraimcarerepo1/releases*
