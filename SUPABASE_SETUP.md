# Supabase setup — product management

The public website now loads products from Supabase, and there's a separate
admin tool to add / edit / delete products and toggle their visibility — all
without redeploying the site.

- **Public site:** `/` (uses `index.html`) — unchanged UI, fetches live data.
- **Admin tool:** `/admin.html` — login-protected product manager.

If Supabase isn't configured, the public site automatically falls back to the
bundled static product list, so nothing breaks before setup is done.

---

## One-time setup (≈ 15 minutes)

### 1. Create a Supabase project
1. Go to <https://supabase.com> → **New project** (free tier is fine).
2. Pick a name and a strong database password; wait for it to provision.

### 2. Create the database table, security rules, and image bucket
1. In the dashboard: **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and **Run**.
3. (Optional but recommended) To pre-fill the existing 53 products, open a new
   query, paste [`supabase/seed.sql`](supabase/seed.sql), and **Run** once.
   - Images come in blank; upload real photos from the admin tool later.
   - ⚠️ Run the seed only once — running it again creates duplicates.

### 3. Create the admin login
1. **Authentication → Users → Add user → Create new user**.
2. Enter the admin's email + a password, and tick **Auto Confirm User**.
3. (Recommended) **Authentication → Providers → Email** → turn **off**
   "Allow new users to sign up", so only you can create admin accounts.

### 4. Connect the app to Supabase
1. **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
2. In the project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Paste the two values into `.env`:
   ```
   VITE_SUPABASE_URL=https://your-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Restart the dev server (`npm run dev`) so it picks up the new env vars.

> The anon key is safe to ship in the browser — Row Level Security limits it to
> reading active products only. **Never** put the `service_role` / secret key in
> `.env`.

---

## Daily use (for the admin)

1. Go to **`/admin.html`** and sign in with the admin email + password.
2. **Add product** → fill name, category (pick or type a new one), optional
   badge, upload a photo (or paste a URL), set status, then **Create**.
3. **Edit** / **Delete** from the row actions.
4. Click the **Active / Hidden** pill to show or hide a product on the public
   site instantly. Hidden products stay in the database but don't appear publicly.

Changes appear on the public site on the next page load — no redeploy needed.

---

## Deploying

Run `npm run build`. The `dist/` folder will contain **both** pages:

- `dist/index.html` — public site
- `dist/admin.html` — admin tool (reachable at `yoursite.com/admin.html`)

Set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment
variables in your host (Netlify / Vercel / etc.) so the production build is
connected to Supabase.

> The admin page is marked `noindex` and is protected by login, but since it
> lives at a public URL, keep the admin password strong. If you want it fully
> hidden, deploy `admin.html` separately or behind host-level access control.
