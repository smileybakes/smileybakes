import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const STATS = [
  { num: '1000+', lbl: 'Happy Customers' },
  { num: '4.6', lbl: 'Star Rating' },
  { num: '500+', lbl: 'Custom Cakes Yearly' },
]

const HERO_IMG = '/hero.avif'

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
        <motion.div
          className="hero-bg"
          style={{ scale: bgScale, backgroundImage: `url('${HERO_IMG}')` }}
        />
        <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }} />

        <motion.div
          className="hero-inner"
          style={{ scale: contentScale, opacity: contentOpacity, y: contentY }}
        >
          <div className="container">
            <div className="hero-content">
              <p className="eyebrow centered">Est. Kotagiri, Tamil Nadu</p>
              <h1>
                Freshly Baked <span className="accent">Happiness</span>
                <br />
                Every Day
              </h1>
              <p>
                Artisan cakes, breads &amp; desserts crafted with love — using
                only the finest ingredients.
              </p>
              <div className="hero-actions">
                <a href="#products" className="btn btn-gold">View our Products</a>
                <a href="#custom-cakes" className="btn btn-outline">Bulk online Orders</a>
              </div>

              <div className="hero-stats">
                {STATS.map((s) => (
                  <div className="stat" key={s.lbl}>
                    <div className="num">{s.num}</div>
                    <div className="lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a href="#about" className="hero-discover">
            <span>Discover</span>
            <span className="chev">⌄</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
