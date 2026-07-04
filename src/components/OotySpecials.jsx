import { motion } from 'framer-motion'

/*
 * Ooty Specials — premium image showcase.
 *
 * Images: swap the `img` URLs below for your own photos once available.
 * Recommended: drop files in  public/products/  and set e.g. '/products/tea-powder.jpg'.
 * Until then these use tasteful stock photos as placeholders.
 */
const HERO_IMAGE ='/products/ooty-hero.jpg'
// Row 1 — three products
const ROW_TOP = [
  {
    name: 'Nilgiri Tea Powder',
    tag: 'Tea',
    img: '/products/tea-powder.jpg',
  },
  {
    name: 'Ooty Dark Chocolates',
    tag: 'Chocolate',
    img: '/products/dark-chocolate.jpg',
  },
  {
    name: 'Pure Eucalyptus Oil',
    tag: 'Eucalyptus',
    img: '/products/eucalyptus-oil.jpg',
  },
]

// Row 2 — two products
const ROW_BOTTOM = [
  {
    name: 'Joint Pain Oil',
    tag: 'Wellness',
    img: '/products/joint-pain-oil.jpg',
  },
  {
    name: 'Migraine Relief Oil',
    tag: 'Wellness',
    img: '/products/migraine-oil.jpg',
  },
]

/* ---------- Motion variants ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function ProductCard({ item }) {
  return (
    <motion.figure className="ooty-card" variants={cardVariant} whileHover={{ y: -10 }}>
      <div className="ooty-card-frame">
        <img
          className="ooty-card-img"
          src={item.img}
          alt={item.name}
          loading="lazy"
          decoding="async"
        />
        <span className="ooty-card-shine" aria-hidden="true" />
        <span className="ooty-card-tag">{item.tag}</span>
      </div>
      <figcaption className="ooty-card-name">{item.name}</figcaption>
    </motion.figure>
  )
}

export default function OotySpecials() {
  return (
    <section className="ooty" id="ooty-specials" aria-labelledby="ooty-heading">
      {/* ---------- Ambient Ooty-landscape background ---------- */}
      <div className="ooty-bg" aria-hidden="true">
        <div className="ooty-mountains" />
        <div className="ooty-fog" />
        <span className="ooty-blob ooty-blob-1" />
        <span className="ooty-blob ooty-blob-2" />
        <span className="ooty-ray" />
        {[...Array(6)].map((_, i) => (
          <span key={i} className={`ooty-leaf ooty-leaf-${i + 1}`}>
            <LeafGlyph />
          </span>
        ))}
      </div>

      <div className="container ooty-inner">
        {/* ================= HEADER ================= */}
        <motion.header
          className="ooty-header"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.span className="eyebrow centered gold-only" variants={fadeUp}>
            From the Nilgiris
          </motion.span>
          <motion.h2 id="ooty-heading" className="ooty-title" variants={fadeUp}>
            Our <span className="ooty-title-accent">Ooty</span> Specials
          </motion.h2>
          <motion.p className="ooty-sub" variants={fadeUp}>
            Bring home the authentic flavours of the Nilgiris with our carefully selected
            Ooty specialties — sourced for freshness, quality, and tradition.
          </motion.p>
        </motion.header>

        {/* ================= HERO SHOWCASE IMAGE ================= */}
        <motion.figure
          className="ooty-hero-media"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            className="ooty-hero-img"
            src={HERO_IMAGE}
            alt="Freshly harvested tea leaves from the misty tea gardens of Ooty"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="ooty-hero-caption">
            <span className="ooty-hero-eyebrow">Signature Collection</span>
            <span className="ooty-hero-title">Handpicked from the misty hills of Ooty</span>
          </figcaption>
        </motion.figure>

        {/* ================= ROW 1 — three products ================= */}
        <motion.div
          className="ooty-row ooty-row-3"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {ROW_TOP.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}
        </motion.div>

        {/* ================= ROW 2 — two products ================= */}
        <motion.div
          className="ooty-row ooty-row-2"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {ROW_BOTTOM.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}
        </motion.div>

        {/* ================= CTA ================= */}
        <motion.div
          className="ooty-cta"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <motion.a
            href="#contact"
            className="ooty-btn ooty-btn-primary"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Visit Our Store
            <ArrowGlyph />
          </motion.a>
          <motion.a
            href="/products/"
            className="ooty-btn ooty-btn-ghost"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Explore Collection
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Inline SVG glyphs (no external icon dependency) ---------- */
function LeafGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  )
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
