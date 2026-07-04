import { resolve } from 'path'
import { renameSync, mkdirSync, rmdirSync, existsSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// After build, move dist/pages/<name>/index.html up to dist/<name>/index.html.
// The page entry HTML lives under pages/ in the source tree (so the repo root
// stays tidy), but GitHub Pages should serve them at /<name>, not /pages/<name>.
function flattenPages() {
  return {
    name: 'flatten-pages',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      const src = resolve(dist, 'pages')
      if (!existsSync(src)) return
      for (const name of ['products', 'gallery', 'admin']) {
        const fromHtml = resolve(src, name, 'index.html')
        const toDir = resolve(dist, name)
        if (!existsSync(fromHtml)) continue
        // Move just the built index.html up to dist/<name>/index.html. We move
        // the file (not the whole dir) because dist/<name>/ may already hold
        // static assets copied from public/<name>/ (e.g. product images), and
        // renaming the directory over them fails with ENOTEMPTY.
        if (!existsSync(toDir)) mkdirSync(toDir, { recursive: true })
        renameSync(fromHtml, resolve(toDir, 'index.html'))
        // Drop the now-empty dist/pages/<name> directory.
        try { rmdirSync(resolve(src, name)) } catch { /* ignore */ }
      }
      // Remove the now-empty dist/pages directory.
      try {
        rmdirSync(src)
      } catch {
        /* not empty / already gone — ignore */
      }
    },
  }
}

// Serve pages at clean paths (no .html) during dev, e.g. /admin and /products.
// In production we get the same clean URLs on GitHub Pages by emitting each
// page as its own  <name>/index.html  (see the build.rollupOptions input keys
// below), which Pages serves natively at  /<name>.
function cleanUrls() {
  const map = {
    '/admin': '/pages/admin/index.html',
    '/admin/': '/pages/admin/index.html',
    '/products': '/pages/products/index.html',
    '/products/': '/pages/products/index.html',
    '/gallery': '/pages/gallery/index.html',
    '/gallery/': '/pages/gallery/index.html',
  }
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (map[req.url]) req.url = map[req.url]
        next()
      })
    },
  }
}

// Multiple pages from one project, each bundled independently so admin code
// never ships in the public site's JS:
//   /         → public marketing site   (index.html)
//   /products → full product catalogue  (products/index.html)
//   /gallery  → bento-grid image gallery (gallery/index.html)
//   /admin    → product & gallery admin  (admin/index.html)
//
// The nested output paths give clean URLs on GitHub Pages (which ignores
// .htaccess / _redirects): a request for /gallery resolves to gallery/index.html.
export default defineConfig({
  plugins: [react(), cleanUrls(), flattenPages()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'pages/products/index.html'),
        gallery: resolve(__dirname, 'pages/gallery/index.html'),
        admin: resolve(__dirname, 'pages/admin/index.html'),
      },
    },
  },
})
