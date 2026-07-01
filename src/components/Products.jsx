import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CATEGORIES as STATIC_CATEGORIES,
  PRODUCTS as STATIC_PRODUCTS,
  PLACEHOLDER,
  formatPrice,
} from '../data/products.js'
import { supabase, isConfigured } from '../lib/supabase.js'

const PER_PAGE = 4 // products shown per desktop carousel page

export default function Products() {
  const [active, setActive] = useState('All')

  // Live products from Supabase. Falls back to the bundled static list if
  // Supabase isn't configured yet, or if the fetch fails for any reason — the
  // site always shows something.
  const [products, setProducts] = useState(STATIC_PRODUCTS)

  useEffect(() => {
    if (!isConfigured) return // keep static list
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

  // If the active filter's category disappears (e.g. admin removed its last
  // product), fall back to 'All' so the carousel never shows an empty state.
  useEffect(() => {
    if (active !== 'All' && !CATEGORIES.includes(active)) setActive('All')
  }, [CATEGORIES, active])

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 720 : true
  )
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)

  const items =
    active === 'All'
      ? products
      : products.filter((p) => p.category === active)

  // Track whether we're on desktop so we can swap between the multi-card
  // carousel (desktop) and the one-card slideshow (mobile).
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 720)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function selectCategory(c) {
    if (c === active) return
    setPage(0) // restart at the first slide on filter change
    setActive(c)
  }

  // Paging math. Desktop shows PER_PAGE cards per page; mobile is a one-card
  // slideshow (a single product per slide).
  const perPage = isDesktop ? PER_PAGE : 1
  const pageCount = Math.max(1, Math.ceil(items.length / perPage))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = items.slice(safePage * perPage, safePage * perPage + perPage)
  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount)
  const goNext = () => setPage((p) => (p + 1) % pageCount)

  // Auto-advance on both desktop and mobile. Pauses on hover/touch, and resets
  // its timer whenever the page changes (manual or auto) or the filter changes.
  useEffect(() => {
    if (paused || pageCount <= 1) return
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pageCount)
    }, 3000)
    return () => clearInterval(id)
  }, [paused, pageCount, safePage, active])

  return (
    <section className="products" id="products">
      <div className="container">
        <motion.div
          className="products-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="eyebrow centered">Signature Products</span>
          <h2 className="section-title">
            Our <span className="accent">Artisan</span> Collection
          </h2>
          <p>
            Every item is baked fresh each morning using time-honored recipes and
            premium ingredients sourced with care.
          </p>
        </motion.div>

        <div className="products-scroll">
        <div className="filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter ${active === c ? 'active' : ''}`}
              onClick={() => selectCategory(c)}
            >
              <span>{c}</span>
              {active === c && (
                <motion.span
                  layoutId="filter-active"
                  className="filter-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        {isDesktop ? (
          /* ---- Desktop: horizontal carousel, one row of PER_PAGE per page ---- */
          <div
            className="carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {pageCount > 1 && (
              <button
                className="carousel-arrow prev"
                onClick={goPrev}
                aria-label="Previous products"
              >
                ‹
              </button>
            )}

            <div className="carousel-viewport">
              <AnimatePresence mode="wait">
                <motion.div
                  className="carousel-row"
                  key={`${active}-${safePage}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {pageItems.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {pageCount > 1 && (
              <button
                className="carousel-arrow next"
                onClick={goNext}
                aria-label="Next products"
              >
                ›
              </button>
            )}

            {pageCount > 1 && (
              <div className="carousel-dots">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === safePage ? 'active' : ''}`}
                    onClick={() => setPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ---- Mobile: one-card swipeable slideshow ---- */
          <div
            className="slideshow"
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <div className="slideshow-viewport">
              <AnimatePresence mode="wait">
                <motion.div
                  className="slide"
                  key={`${active}-${safePage}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) goNext()
                    else if (info.offset.x > 50) goPrev()
                  }}
                >
                  {pageItems.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {pageCount > 1 && (
              <div className="carousel-dots">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === safePage ? 'active' : ''}`}
                    onClick={() => setPage(i)}
                    aria-label={`Go to product ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p, index = 0, animateOnMount = false }) {
  const motionProps = animateOnMount
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut', delay: (index % 4) * 0.08 },
      }
    : {}

  return (
    <motion.article className="card" whileHover={{ y: -6 }} {...motionProps}>
      <div className="card-media">
        {p.badge && <span className="badge">{p.badge}</span>}
        <motion.img
          src={p.img || PLACEHOLDER}
          alt={p.name}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER
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
