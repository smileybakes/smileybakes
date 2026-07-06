import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import {
  PRODUCTS as STATIC_PRODUCTS,
  PLACEHOLDER,
  formatPrice,
} from '../data/products.js'
import { useCategories } from '../data/useCategories.js'
import { supabase, isConfigured, PRODUCTS_TABLE } from '../lib/supabase.js'

// Full product catalogue shown as a clean card grid (no carousel), with the
// same category filters as the homepage section. Lives at /products.
export default function ProductsPage() {
  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')

  // Live products from Supabase, falling back to the bundled static list if
  // Supabase isn't configured or the fetch fails — the page always shows items.
  const [products, setProducts] = useState(STATIC_PRODUCTS)

  useEffect(() => {
    if (!isConfigured) return
    let cancelled = false
    supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load products from Supabase:', error.message)
          return
        }
        if (data && data.length) setProducts(data)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Admin-managed categories, plus 'All' and any category a product uses that
  // isn't in the table yet (so nothing becomes unreachable).
  const managed = useCategories({ mergeFromProducts: products })
  const CATEGORIES = useMemo(() => ['All', ...managed], [managed])

  // If the active filter's category disappears, fall back to 'All'.
  useEffect(() => {
    if (active !== 'All' && !CATEGORIES.includes(active)) setActive('All')
  }, [CATEGORIES, active])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const inCat = active === 'All' || p.category === active
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      return inCat && inQuery
    })
  }, [products, active, query])

  return (
    <>
      <Navbar />
      <main>
        <section className="products products-dark products-page" id="products">
          <div className="container">
            <motion.div
              className="products-head"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="eyebrow centered gold-only">Our Full Menu</span>
              <h1 className="section-title light">
                All <span className="accent-gold">Products</span>
              </h1>
              <p>
                Freshly baked cakes, Ooty-special bakery items, homemade
                chocolates, desserts and more — browse the complete Smiley Bakes
                collection from Kotagiri.
              </p>
            </motion.div>

            {/* ---- Search (sticky band; only the search floats) ---- */}
            <div className="menu-search-bar">
              <div className="menu-search">
                <SearchGlyph />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the menu…"
                  aria-label="Search the menu"
                />
              </div>
            </div>

            {/* ---- Category filter pills ---- */}
            <div className="menu-filters">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`menu-filter ${active === c ? 'active' : ''}`}
                  onClick={() => setActive(c)}
                  aria-pressed={active === c}
                >
                  {c}
                </button>
              ))}
            </div>

            {items.length ? (
              <div className="menu-grid">
                {items.map((p, i) => (
                  <ProductCard key={p.id} p={p} index={i} />
                ))}
              </div>
            ) : (
              <p className="menu-empty">No items match your search.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function ProductCard({ p, index = 0 }) {
  return (
    <motion.article
      className="card"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 8) * 0.05 }}
    >
      <div className="card-media">
        {p.badge && <span className="badge badge-left">{p.badge}</span>}
        {p.category && <span className="badge badge-right">{p.category}</span>}
        <motion.img
          ref={(el) => {
            if (el && el.complete && el.naturalWidth > 0) el.classList.add('loaded')
          }}
          src={p.img || PLACEHOLDER}
          alt={p.name}
          loading="lazy"
          decoding="async"
          onLoad={(e) => e.currentTarget.classList.add('loaded')}
          onError={(e) => {
            if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER
            else e.currentTarget.classList.add('loaded')
          }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="card-body">
        <div className="card-head">
          <h3 className="card-title">{p.name}</h3>
          {formatPrice(p) && <div className="card-price">{formatPrice(p)}</div>}
        </div>
        {p.desc && <p className="card-desc">{p.desc}</p>}
      </div>
    </motion.article>
  )
}
