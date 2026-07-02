import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Small line icons for the stat row.
const StatIcon = {
  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2.5 14.94 8.46 21.5 9.42l-4.75 4.63 1.12 6.54L12 17.6l-5.87 3.09 1.12-6.54L2.5 9.42l6.56-.96L12 2.5Z" />
    </svg>
  ),
  wheat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V8M12 8c0-2 1.5-3.5 3.5-3.5M12 8c0-2-1.5-3.5-3.5-3.5M12 13c0-2 1.5-3.5 3.5-3.5M12 13c0-2-1.5-3.5-3.5-3.5M12 18c0-2 1.5-3.5 3.5-3.5M12 18c0-2-1.5-3.5-3.5-3.5" />
    </svg>
  ),
}

const STATS = [
  { icon: 'customers', num: '1000+', lbl: 'Happy Customers' },
  { icon: 'star', num: '4.9', lbl: 'Google Rating' },
  { icon: 'wheat', num: 'Since 1973', lbl: 'Baking Happiness' },
]

export default function Hero() {
  const containerRef = useRef(null)

  // Track scroll progress across the tall hero section.
  // 0 = section top hits viewport top, 1 = section bottom hits viewport top.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Background zooms in as you scroll through the hero.
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])
  // Overlay darkens to keep text legible while zooming.
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.85])
  // Title scales up slightly and fades out, content drifts up.
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section className="hero-scroll" id="top" ref={containerRef}>
      <div className="hero-sticky">
        <motion.div className="hero-bg" style={{ scale: bgScale }} />
        <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }} />

        <motion.div
          className="hero-inner"
          style={{ scale: contentScale, opacity: contentOpacity, y: contentY }}
        >
          <div className="container">
            <div className="hero-content">
              <p className="eyebrow centered">Fresh from Kotagiri</p>
              <h1>
                Freshly Baked Happiness
                <br />
                <span className="accent">Every Day</span>
              </h1>

              <div className="hero-divider" aria-hidden="true">
                <span className="line" />
                <span className="leaf">🌿</span>
                <span className="line" />
              </div>

              <p>
                Traditional Varkey, Tea Salt Cookies &amp; Fresh Cakes
                handcrafted with love using the finest ingredients.
              </p>
              <div className="hero-actions">
                <a href="#products" className="btn btn-gold">
                  View Products <span className="btn-arrow">→</span>
                </a>
                <a href="#custom-cakes" className="btn btn-outline">
                  Order Online <span className="btn-arrow">→</span>
                </a>
              </div>

              <div className="hero-stats">
                {STATS.map((s) => (
                  <div className="stat" key={s.lbl}>
                    <div className="stat-icon">{StatIcon[s.icon]}</div>
                    <div className="stat-text">
                      <div className="num">{s.num}</div>
                      <div className="lbl">{s.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
