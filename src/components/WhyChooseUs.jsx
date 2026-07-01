import { motion } from 'framer-motion'

const ICONS = {
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1" /><circle cx="17.5" cy="10.5" r="1" />
      <circle cx="8.5" cy="7.5" r="1" /><circle cx="6.5" cy="12.5" r="1" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z" />
    </svg>
  ),
  chef: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <path d="M6 17h12" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 14.94 8.46 21.5 9.42l-4.75 4.63 1.12 6.54L12 17.6l-5.87 3.09 1.12-6.54L2.5 9.42l6.56-.96L12 2.5Z" />
    </svg>
  ),
}

const FEATURES = [
  { icon: 'sun', title: 'Baked Fresh Daily', desc: 'Every item is prepared from scratch each morning. We never serve day-old products — ever.' },
  { icon: 'leaf', title: 'Premium Ingredients', desc: 'We partner with local farms and trusted suppliers for the finest organic butter, flour, and seasonal produce.' },
  { icon: 'palette', title: 'Custom Designs Available', desc: 'From minimalist elegance to elaborate sculptural cakes — our artists bring your vision to life.', highlight: true },
  { icon: 'chef', title: 'Expert Pastry Chefs', desc: 'Our team of classically trained pastry chefs bring decades of collective experience to each creation.' },
  { icon: 'clock', title: 'Same-Day Pickup', desc: "Order by 10am for same-day pickup on select items. We believe great pastry shouldn't require a wait." },
  { icon: 'star', title: 'Exceptional Service', desc: '5-star rated on Google & Yelp. We go above and beyond to make every occasion unforgettable.' },
]

const STATS = [
  { num: '1000+', lbl: 'Happy Customers' },
  { num: '500+', lbl: 'Custom Cakes / Year' },
  { num: '4.6', star: true, lbl: 'Average Rating' },
  { num: 'affordable ', lbl: 'Price Range' },
]

const headVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const gridVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const statsVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const statVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function WhyChooseUs() {
  return (
    <section className="why" id="why-choose-us">
      <div className="container">
        <motion.div
          className="why-head"
          variants={headVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="eyebrow centered gold-only">Why Choose Us</span>
          <h2 className="section-title light">
            The <span className="accent-gold">SMILEY</span> Difference
          </h2>
          <p>
            More than a bakery — a destination where quality, craft, and care
            converge to create something truly special.
          </p>
        </motion.div>

        <motion.div
          className="why-grid"
          variants={gridVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {FEATURES.map((f) => (
            <motion.article
              className={`why-card ${f.highlight ? 'highlight' : ''}`}
              key={f.title}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="why-icon">{ICONS[f.icon]}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="why-stats"
          variants={statsVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {STATS.map((s) => (
            <motion.div className="why-stat" key={s.lbl} variants={statVariant}>
              <div className="num">
                {s.num}
                {s.star && <span className="star">★</span>}
              </div>
              <div className="lbl">{s.lbl}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
