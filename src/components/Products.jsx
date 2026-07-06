import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CATEGORIES as STATIC_CATEGORIES,
  PRODUCTS as STATIC_PRODUCTS,
  PLACEHOLDER,
  formatPrice,
} from '../data/products.js'
import { supabase, isConfigured, PRODUCTS_TABLE } from '../lib/supabase.js'

const HOME_LIMIT = 9 // products shown on the homepage before "View Full Menu"

export default function Products() {
  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')

  // Live products from Supabase. Falls back to the bundled static list if
  // Supabase isn't configured yet, or if the fetch fails for any reason — the
  // site always shows something.
  const [products, setProducts] = useState(STATIC_PRODUCTS)

  useEffect(() => {
    if (!isConfigured) return // keep static list
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
          return // keep whatever is already shown (static list)
        }
        if (data && data.length) setProducts(data)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Build the category filter list from whatever products we actually have,
  // preserving the curated order from the static list and appending any new
  // categories the admin may have introduced.
  const CATEGORIES = useMemo(() => {
    const present = new Set(products.map((p) => p.category))
    const ordered = STATIC_CATEGORIES.filter(
      (c) => c === 'All' || present.has(c)
    )
    const known = new Set(ordered)
    for (const c of present) if (!known.has(c)) ordered.push(c)
    return ordered
  }, [products])

  // If the active filter's category disappears, fall back to 'All'.
  useEffect(() => {
    if (active !== 'All' && !CATEGORIES.includes(active)) setActive('All')
  }, [CATEGORIES, active])

  // Filter by active category and search query.
  const filtered = useMemo(() => {
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

  // Homepage shows a limited set; the full catalogue lives at /products.
  const visible = filtered.slice(0, HOME_LIMIT)
  const hasMore = filtered.length > HOME_LIMIT

  return (
    <section className="products products-dark" id="products">
      <div className="container">
        <motion.div
          className="products-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="eyebrow centered gold-only">Signature Products</span>
          <h2 className="section-title light">
            Our <span className="accent-gold">Artisan</span> Collection
          </h2>
          <p>
            Every item is baked fresh each morning using time-honored recipes and
            premium ingredients sourced with care.
          </p>
        </motion.div>

        {/* ---- Search ---- */}
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

        {/* ---- Static card grid ---- */}
        {visible.length ? (
          <div className="menu-grid">
            {visible.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="menu-empty">No items match your search.</p>
        )}

        {hasMore && (
          <div className="menu-more">
            <a href="/products/" className="btn btn-gold">
              View Full Menu
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ p, index = 0 }) {
  const price = formatPrice(p)

  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: (index % 9) * 0.05 }}
      whileHover={{ y: -6 }}
    >
      <div className="card-media">
        {p.badge && <span className="badge badge-left">{p.badge}</span>}
        {p.category && <span className="badge badge-right">{p.category}</span>}
        <motion.img
          ref={(el) => {
            // If the image was already cached, onLoad may not fire — reveal it now.
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
          {price && <div className="card-price">{price}</div>}
        </div>
        {p.desc && <p className="card-desc">{p.desc}</p>}
      </div>
    </motion.article>
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
