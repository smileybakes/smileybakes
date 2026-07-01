# Smiley Bakes

Static React (Vite) landing page for an artisan bakery — recreated to match the reference design (cream / black / gold / rose palette, Cormorant Garamond + Jost typography).

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## Structure

```
src/
  App.jsx
  styles.css            # design tokens + all styling
  components/
    Navbar.jsx
    Hero.jsx
    Story.jsx
    Products.jsx        # category filter + product grid
    Footer.jsx
  data/
    products.js         # edit here to add more products / categories
```

## Managing products

Products are managed through a Supabase-backed admin tool — the client can add,
edit, delete, and show/hide products without redeploying the site. See
[`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) for the one-time setup.

- Public site: `/` — fetches live products from Supabase (falls back to the
  bundled list in `src/data/products.js` if Supabase isn't configured).
- Admin tool: `/admin.html` — login-protected product manager.

`src/data/products.js` is now only the offline fallback / seed source.

## Deployment & SEO

Hosting on GitHub Pages with a Hostinger domain, plus the SEO setup steps, are
documented in [`DEPLOYMENT.md`](DEPLOYMENT.md).
