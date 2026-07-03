import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { PLACEHOLDER } from '../data/products.js'
import { GALLERY_PLACEHOLDERS } from '../data/gallery.js'
import { supabase, isConfigured } from '../lib/supabase.js'

// Bento-grid gallery shown at /gallery. Tiles come from the Supabase
// `gallery_images` table (managed in /admin → Gallery tab); the admin sets each
// tile's size and order, which is what shapes the grid here. Falls back to a
// bundled placeholder layout if Supabase isn't configured or the fetch fails,
// so the page always shows something.
export default function GalleryPage() {
  const [images, setImages] = useState(GALLERY_PLACEHOLDERS)

  useEffect(() => {
    if (!isConfigured) return // keep placeholder layout
    let cancelled = false
    supabase
      .from('gallery_images')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load gallery from Supabase:', error.message)
          return // keep whatever is already shown (placeholder layout)
        }
        if (data && data.length) setImages(data)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="gallery-page" id="gallery">
          <div className="container">
            <motion.div
              className="products-head"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="eyebrow centered">Our Gallery</span>
              <h1 className="section-title">
                A Taste of <span className="accent">Smiley Bakes</span>
              </h1>
              <p>
                A glimpse of the cakes, bakes and celebrations we’ve been part of
                in Kotagiri. Every creation, baked fresh with love.
              </p>
            </motion.div>

            <div className="bento-grid">
              {images.map((img, i) => (
                <GalleryTile key={img.id} img={img} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function GalleryTile({ img, index = 0 }) {
  return (
    <motion.figure
      className={`bento-tile bento-${img.size || 'small'}`}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: (index % 8) * 0.05 }}
    >
      <img
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0) el.classList.add('loaded')
        }}
        src={img.img || PLACEHOLDER}
        alt={img.caption || 'Smiley Bakes gallery image'}
        loading="lazy"
        decoding="async"
        onLoad={(e) => e.currentTarget.classList.add('loaded')}
        onError={(e) => {
          if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER
          else e.currentTarget.classList.add('loaded')
        }}
      />
      {img.caption && <figcaption className="bento-caption">{img.caption}</figcaption>}
    </motion.figure>
  )
}
