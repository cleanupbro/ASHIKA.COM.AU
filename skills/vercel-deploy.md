# Skill: Vercel Deployment

**Purpose:** Deploy projects to Vercel quickly and reliably
**Created:** January 2026

---

## Quick Deploy (One Command)

From the **project root folder** (where `.vercel` folder exists or will be created):

```bash
vercel --prod --yes
```

That's it. Push to GitHub = auto-deploy. Manual deploy = one command.

---

## Project Setup (First Time Only)

### 1. Link Project to Vercel

```bash
cd /path/to/project
vercel link --yes --project YOUR_PROJECT_NAME
```

### 2. Verify Settings in Vercel Dashboard

Go to: `https://vercel.com/YOUR_TEAM/YOUR_PROJECT/settings/build-and-deployment`

Check:
- **Framework Preset:** Should auto-detect (Next.js, etc.)
- **Root Directory:** Set this if your app is in a subfolder (e.g., `app` or `frontend`)
- **Build Command:** Usually auto-detected
- **Output Directory:** Usually auto-detected

---

## Folder Structure Rules

### Simple Project (No Root Directory needed)
```
my-project/           <- Deploy from here
├── package.json
├── src/
└── .vercel/          <- Created by `vercel link`
```

### Monorepo / Subfolder App (Root Directory needed)
```
my-repo/              <- Deploy from here
├── .vercel/          <- Created by `vercel link`
├── backend/
└── frontend/         <- Set Root Directory to "frontend" in Vercel
    ├── package.json
    └── src/
```

**Key Rule:** The `.vercel` folder should be in the SAME folder you push to GitHub.

---

## Troubleshooting

### "Path does not exist" error
**Cause:** Root Directory is set but you're deploying from the app folder
**Fix:** Deploy from the PARENT folder, or clear Root Directory setting

### GitHub push doesn't trigger deployment
**Causes:**
1. Root Directory misconfigured
2. GitHub webhook broken
3. Build errors (check Vercel dashboard)

**Fix:** Trigger manual deploy:
```bash
vercel --prod --yes
```

### Deploy hook stays PENDING
**Cause:** Queue or configuration issue
**Fix:** Use CLI deploy instead of hooks

---

## Deploy Hook (Alternative Method)

Create in Vercel Dashboard → Settings → Git → Deploy Hooks

```bash
curl -X POST "YOUR_DEPLOY_HOOK_URL"
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `vercel` | Preview deploy |
| `vercel --prod` | Production deploy |
| `vercel --prod --yes` | Production deploy (skip prompts) |
| `vercel link` | Link folder to Vercel project |
| `vercel list` | List recent deployments |
| `vercel logs URL` | View deployment logs |

---

## EphraimCare Specific

- **Repo:** `cleanupbro/ephraimcarerepo1`
- **Deploy from:** `/clients/ephraimcare/`
- **Root Directory:** `ephraim-care-app`
- **Domain:** www.ephraimcare.com.au

```bash
cd "/Users/shamalkrishna/Desktop/Dev Workspace 💵/clients/ephraimcare"
vercel --prod --yes
```

---

*Simple. Push or run one command. Done.*
