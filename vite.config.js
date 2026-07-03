import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serve pages at clean paths (no .html) during dev, e.g. /admin and /products.
// In production the host does the same via _redirects / .htaccess.
function cleanUrls() {
  const map = {
    '/admin': '/admin.html',
    '/admin/': '/admin.html',
    '/products': '/products.html',
    '/products/': '/products.html',
    '/gallery': '/gallery.html',
    '/gallery/': '/gallery.html',
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

// Three separate pages from one project:
//   /         → public marketing site (index.html)
//   /products → full product catalogue (products.html)
//   /gallery  → bento-grid image gallery (gallery.html)
//   /admin    → product & gallery admin  (admin.html)
// They share the Supabase client but are bundled independently, so admin code
// never ships in the public site's JS.
export default defineConfig({
  plugins: [react(), cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
