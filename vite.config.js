import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serve the admin page at a clean "/admin" path (no .html) during dev.
// In production, Netlify does the same via the _redirects file.
function adminCleanUrl() {
  return {
    name: 'admin-clean-url',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin.html'
        }
        next()
      })
    },
  }
}

// Two separate pages from one project:
//   /        → public marketing site (index.html)
//   /admin   → product admin tool    (admin.html)
// They share the Supabase client but are bundled independently, so admin code
// never ships in the public site's JS.
export default defineConfig({
  plugins: [react(), adminCleanUrl()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
