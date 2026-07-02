# Smiley Bakes — Complete Setup & Hosting Guide

Everything needed to run, host, and manage the Smiley Bakes site, in one place.

- **Hosting:** GitHub Pages (free) — auto-deploys on every push to `main`.
- **Domain:** `www.smileybakes.in` (bought from Hostinger).
- **Database:** Supabase (products + product images).
- **Repo:** `https://github.com/smileybakes/smileybakes` (must be **public** — GitHub Pages is not free on private repos).

---

## Table of contents

1. [Run locally](#1-run-locally)
2. [Supabase database](#2-supabase-database)
3. [Deploy to GitHub Pages](#3-deploy-to-github-pages)
4. [Connect the custom domain (fixes the blank page)](#4-connect-the-custom-domain-fixes-the-blank-page)
5. [Managing products (admin tool)](#5-managing-products-admin-tool)
6. [SEO](#6-seo)
7. [Troubleshooting](#7-troubleshooting)
8. [Security checklist](#8-security-checklist)

---

## 1. Run locally

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the built site
```

Create a `.env` file in the project root (copy from `.env.example`) with your
Supabase project values:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

> `.env` is gitignored — it never gets committed. The **anon** key is safe in the
> browser because Row Level Security (RLS) limits it to reading active products.
> **Never** put the `service_role` / secret key in `.env`.

---

## 2. Supabase database

The public site loads products from Supabase; the admin tool edits them without
redeploying. If Supabase isn't configured, the site falls back to the bundled
list in `src/data/products.js`.

### 2a. One-time database setup

1. Create a Supabase project (free tier is fine) — pick a strong DB password.
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   This creates the `products` table, RLS policies, and the `product-images` storage bucket.
3. Apply the pricing migration: new query → paste [`supabase/migrations/001_add_price.sql`](supabase/migrations/001_add_price.sql) → **Run**.
4. (Fresh project only) To seed the initial products, run [`supabase/seed.sql`](supabase/seed.sql) **once**.
   ⚠️ Running it twice creates duplicates.

Alternatively, from your machine (needs the DB connection URI in `.db-url.local`):

```bash
npm run db:setup     # runs schema.sql + seed.sql (skips seed if table not empty)
npm run db:migrate   # applies everything in supabase/migrations/
```

### 2b. Create the admin login

Auth users are **per project** — they don't copy across when you migrate data.

1. **Authentication → Users → Add user → Create new user**.
2. Enter the admin email + password, tick **Auto Confirm User**.
3. (Recommended) **Authentication → Providers → Email** → turn **off** "Allow new
   users to sign up" so only you can create admin accounts.

### 2c. Migrating data to a new Supabase project (if ever needed)

Products are copied over a direct Postgres connection; images are copied from the
old storage bucket to the new one. This has already been done for the current
project. To repeat it for a future move, you need, from **both** projects:

- Postgres password (**Project Settings → Database**), and
- the new project's `service_role` key (**Project Settings → API**) for uploading images.

Then adapt the migration approach used previously (read old rows → copy image
files into the new bucket → rewrite `img` URLs → insert rows preserving ids).

---

## 3. Deploy to GitHub Pages

Deployment is automatic: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds the site and publishes `dist/` on every push to `main`.

Do these **once**, in order:

### 3a. Repo must be PUBLIC
GitHub Pages is **not free on private repos**. Repo → **Settings → General →
Danger Zone → Change visibility → Public**. (No secrets live in the code, and the
anon key in the built site is safe under RLS.)

### 3b. Add build secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

- `VITE_SUPABASE_URL` = `https://<your-project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = your anon/public key

These get baked into the build. Without them the deployed site can't reach Supabase.

### 3c. Set the Pages source
Repo → **Settings → Pages → Build and deployment → Source** = **GitHub Actions**
(not "Deploy from a branch").

### 3d. Push (or re-run the deploy)

```bash
git add .
git commit -m "Deploy"
git push          # origin -> smileybakes/smileybakes, branch main
```

Watch the **Actions** tab for a green check. If a run failed *before* Pages was
enabled or *before* the secrets existed, open that run → **Re-run all jobs**.

---

## 4. Connect the custom domain (fixes the blank page)

> **Why the github.io URL shows a blank page:** the site is built to be served
> from the **root** of a domain (`/assets/...`). At `smileybakes.github.io/smileybakes/`
> it's under a subpath, so the JS/CSS 404 and nothing renders. Serving it from
> `www.smileybakes.in` (root) fixes this — no code change needed.

### 4a. Set the custom domain in GitHub
Repo → **Settings → Pages → Custom domain** → enter `www.smileybakes.in` → **Save**.
(The repo already contains [`public/CNAME`](public/CNAME) with this value, so it
sticks across builds.)

### 4b. Point Hostinger DNS at GitHub
In Hostinger's DNS panel for `smileybakes.in`, **delete the default parking
records first**, then add:

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| CNAME | `www` | `smileybakes.github.io`  |
| A     | `@`   | `185.199.108.153`        |
| A     | `@`   | `185.199.109.153`        |
| A     | `@`   | `185.199.110.153`        |
| A     | `@`   | `185.199.111.153`        |

> The CNAME value is the **account** host `smileybakes.github.io` — **not**
> `smileybakes.github.io/smileybakes`. The 4 A records point the bare
> `smileybakes.in` at GitHub (which redirects to `www`).

### 4c. Enforce HTTPS
DNS can take a few minutes up to ~24 hours to propagate. Once the domain check in
**Settings → Pages** passes, tick **Enforce HTTPS** (free SSL, required for SEO).

### 4d. Verify

```bash
dig +short www.smileybakes.in            # should show GitHub's IPs / CNAME
```

Then open `https://www.smileybakes.in` — the site should load fully with no 404s.

---

## 5. Managing products (admin tool)

- **Public site:** `/` — shows active products.
- **Admin tool:** `/admin.html` — login-protected manager.

> On GitHub Pages the clean `/admin` URL does **not** work (the Netlify
> `_redirects` file is ignored). Use the full URL **`www.smileybakes.in/admin.html`**
> and bookmark it.

Daily use:
1. Go to `/admin.html`, sign in with the admin email + password.
2. **Add product** → name, category, optional badge, upload a photo (or paste a
   URL), set price/status → **Create**.
3. **Edit** / **Delete** from each row.
4. Click the **Active / Hidden** pill to show or hide a product publicly.

Changes appear on the public site on the next page load — no redeploy needed.

---

## 6. SEO

After the site is live at `https://www.smileybakes.in`:

1. **Google Search Console** — add the site, verify (DNS TXT record in Hostinger
   or HTML meta), submit `https://www.smileybakes.in/sitemap.xml`.
2. **Google Business Profile** — claim and optimize it. For a local bakery this is
   the #1 SEO driver (Maps results, star rating, "cake shop near me").
3. Confirm HTTPS works and both `http://` and bare `smileybakes.in` redirect to
   `https://www.smileybakes.in`.

Already in the code: title/description/canonical/robots meta, Open Graph + Twitter
cards, LocalBusiness/Bakery JSON-LD, [`public/robots.txt`](public/robots.txt),
[`public/sitemap.xml`](public/sitemap.xml).

---

## 7. Troubleshooting

| Symptom | Cause & fix |
|---|---|
| **Blank page at `…github.io/smileybakes/`, assets 404** | Subpath issue. Fix by connecting the custom domain (section 4) so the site serves from root. |
| **Deploy fails: "Ensure GitHub Pages has been enabled"** | Pages source not set. Do 3c, then re-run the workflow. |
| **Site loads but no products / falls back to static list** | Missing/incorrect Actions secrets (3b), or the anon key/URL point at the wrong Supabase project. |
| **Deploy fails on a private repo** | GitHub Pages isn't free on private repos — make it public (3a). |
| **Can't log into `/admin.html`** | No admin user in this Supabase project. Create one (2b). |
| **Images broken after a DB migration** | `img` URLs still point at the old project's storage. Copy the image files to the new bucket and rewrite the URLs. |

---

## 8. Security checklist

- **`.env` / secrets** are gitignored — never commit real keys.
- The **anon** key is safe in the browser (RLS-limited). The **`service_role`**
  key bypasses RLS — keep it out of the repo and the browser; use it only for
  server-side/one-off scripts.
- **Rotate any credential you pasted into a chat or shared** — Supabase DB
  passwords, `service_role` keys, and GitHub Personal Access Tokens
  (`https://github.com/settings/tokens`).
- Keep the admin password strong — `/admin.html` lives at a public URL (it's
  `noindex` + login-protected, but reachable).
