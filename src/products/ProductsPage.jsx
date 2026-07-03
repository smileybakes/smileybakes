import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import {
  CATEGORIES as STATIC_CATEGORIES,
  PRODUCTS as STATIC_PRODUCTS,
  PLACEHOLDER,
  formatPrice,
} from '../data/products.js'
import { supabase, isConfigured } from '../lib/supabase.js'

// Full product catalogue shown as a clean card grid (no carousel), with the
// same category filters as the homepage section. Lives at /products.
export default function ProductsPage() {
  const [active, setActive] = useState('All')

  // Live products from Supabase, falling back to the bundled static list if
  // Supabase isn't configured or the fetch fails — the page always shows items.
  const [products, setProducts] = useState(STATIC_PRODUCTS)

  useEffect(() => {
    if (!isConfigured) return
    let cancelled = false
    supabase
      .from('products')
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

  // Build the category list from the products actually present, preserving the
  // curated order and appending any new categories the admin introduced.
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

  const items =
    active === 'All'
      ? products
      : products.filter((p) => p.category === active)

  return (
    <>
      <Navbar />
      <main>
        <section className="products products-page" id="products">
          <div className="container">
            <motion.div
              className="products-head"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="eyebrow centered">Our Full Menu</span>
              <h1 className="section-title">
                All <span className="accent">Products</span>
              </h1>
              <p>
                Freshly baked cakes, Ooty-special bakery items, homemade
                chocolates, desserts and more — browse the complete Smiley Bakes
                collection from Kotagiri.
              </p>
            </motion.div>

            <div className="filters">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`filter ${active === c ? 'active' : ''}`}
                  onClick={() => setActive(c)}
                >
                  <span>{c}</span>
                  {active === c && (
                    <motion.span
                      layoutId="filter-active-page"
                      className="filter-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {items.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ProductCard({ p, index = 0 }) {
  return (
    <motion.article
      className="card"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 8) * 0.05 }}
    >
      <div className="card-media">
        {p.badge && <span className="badge">{p.badge}</span>}
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
        <div className="card-cat">{p.category}</div>
        <h3 className="card-title">{p.name}</h3>
        {p.desc && <p className="card-desc">{p.desc}</p>}
        {formatPrice(p) && <div className="card-price">{formatPrice(p)}</div>}
      </div>
    </motion.article>
  )
}
