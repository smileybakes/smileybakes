# Deployment & SEO Guide

How to host the Smiley Bakes site for free on **GitHub Pages** with a custom
domain bought from **Hostinger**, and how to get it set up for SEO.

- **Hosting:** GitHub Pages (free static hosting, serves the built `dist/` folder)
- **Domain:** `www.smileybakes.in` (domain bought from Hostinger, DNS pointed at GitHub)
- **Deploy:** automatic via GitHub Actions on every push to `main`

---

## Files already added for this

| File | Purpose |
|---|---|
| [`public/CNAME`](public/CNAME) | Holds `www.smileybakes.in` so the custom domain sticks across builds (Vite copies `public/` → `dist/`). |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Builds the Vite site and publishes `dist/` to GitHub Pages on every push to `main`. |

---

## Setup checklist (do once, in order)

### 1. Add build secrets in GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon/public key

These get baked into the build. The anon key is safe to expose **only if Row
Level Security (RLS) is enabled** on all Supabase tables — see
[`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).

### 2. Set the Pages source

Repo → **Settings → Pages → Build and deployment → Source** = **GitHub Actions**
(not "Deploy from a branch").

### 3. Push the code

```bash
git add .
git commit -m "Add GitHub Pages deploy + CNAME"
git push
```

The workflow runs automatically — watch the **Actions** tab for a green check.

### 4. Connect the custom domain

Repo → **Settings → Pages → Custom domain** → enter `www.smileybakes.in` → Save.
After the DNS check passes, tick **Enforce HTTPS** (free SSL from GitHub —
required for good SEO).

### 5. Point Hostinger DNS at GitHub

In Hostinger's DNS panel for `smileybakes.in`, **delete the default parking
records first**, then add:

| Type  | Name  | Value                          |
|-------|-------|--------------------------------|
| CNAME | `www` | `<your-github-username>.github.io` |
| A     | `@`   | `185.199.108.153`              |
| A     | `@`   | `185.199.109.153`              |
| A     | `@`   | `185.199.110.153`              |
| A     | `@`   | `185.199.111.153`              |

The 4 A records point the bare `smileybakes.in` at GitHub Pages (which redirects
to `www`). DNS can take a few minutes up to ~24 hours to propagate.

---

## SEO activation (after the site loads at https://www.smileybakes.in)

1. **Google Search Console** — add `https://www.smileybakes.in`, verify with a
   **DNS TXT record** in Hostinger (or the HTML meta method), then submit
   `https://www.smileybakes.in/sitemap.xml`.
2. **Google Business Profile** — claim and optimize it. For a local bakery this
   is the #1 SEO driver: it powers Google Maps results, the star rating from
   your real reviews, and "cake shop near me" searches.
3. Confirm HTTPS works and that both `http://` and the bare `smileybakes.in`
   redirect to `https://www.smileybakes.in`.

### What's already in the code for SEO

- Title, meta description, canonical URL, and `robots` meta — [`index.html`](index.html)
- Open Graph + Twitter card tags (social/WhatsApp link previews)
- Geo tags + **LocalBusiness / Bakery structured data** (JSON-LD)
- [`public/robots.txt`](public/robots.txt) (admin disallowed) and [`public/sitemap.xml`](public/sitemap.xml)

---

## Gotchas specific to GitHub Pages

- **`/admin` clean URL does not work.** The [`public/_redirects`](public/_redirects)
  file is Netlify-only and is ignored by GitHub Pages. Use the full URL
  **`www.smileybakes.in/admin.html`** for the admin tool (bookmark it).
- **Use the custom domain, not `username.github.io/smiley-bakes/`.** All the
  canonical/OG URLs in the markup assume the root domain. The default subpath
  URL would break them (and would require a Vite `base` change).
- **Content renders client-side (JS).** This is fine for Google and for local
  SEO, which is driven by the JSON-LD and your Google Business Profile.
