import { motion } from 'framer-motion'

const FEATURES = [
  { title: 'Fresh Daily', desc: 'Baked every morning from scratch.' },
  { title: 'Premium Ingredients', desc: 'Sourced from trusted local farms.' },
  { title: 'Handcrafted', desc: 'Made by expert pastry artisans.' },
  { title: 'Custom Orders', desc: 'Tailored exactly to your vision.' },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cakeImageVariant = {
  hidden: { opacity: 0, x: -40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

const breadImageVariant = {
  hidden: { opacity: 0, x: 40, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 0.25, ease: 'easeOut' },
  },
}

const ratingVariant = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12, delay: 0.45 },
  },
}

const eyebrowVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const headingLineVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

const paragraphVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const featuresVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const featureVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const buttonVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

export default function Story() {
  return (
    <motion.section
      className="story"
      id="about"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container story-grid">
        <div className="story-images">
          {/* <motion.img
            className="img-main"
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80"
            alt="Plated dessert"
            variants={cakeImageVariant}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          /> */}
          <motion.img
            className="img-solo"
            src="/teawithvarkey.png"
            alt="Assorted pastries"
            variants={breadImageVariant}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          />
          {/* <motion.div
            className="rating-badge"
            variants={ratingVariant}
            whileHover={{ y: -6, scale: 1.05 }}
          >
            <div className="score">4.6</div>
            <div className="stars">★★★★★</div>
            <div className="txt">Star Rating</div>
          </motion.div> */}
        </div>

        <div className="story-copy">
          <motion.span className="eyebrow" variants={eyebrowVariant}>
            Our Story
          </motion.span>
          <h2 className="section-title">
            <motion.span
              style={{ display: 'block' }}
              variants={headingLineVariant}
            >
              Baked With Passion,
            </motion.span>
            <motion.span
              className="accent"
              style={{ display: 'block' }}
              variants={headingLineVariant}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Served With Love
            </motion.span>
          </h2>
          <motion.p variants={paragraphVariant}>
            At Smiley Bakes, every creation begins with a simple belief: that
            food made with intention and the finest ingredients has the power to
            create lasting memories. Nestled in the heart of town, our bakery is
            a sanctuary where traditional techniques meet modern artistry.
          </motion.p>
          <motion.p variants={paragraphVariant}>
            {/* From the moment you walk through our doors, you're welcomed by the
            warm aroma of freshly baked bread and the sight of meticulously
            crafted pastries. */}
          </motion.p>

          <motion.div className="features" variants={featuresVariant}>
            {FEATURES.map((f) => (
              <motion.div
                className="feature"
                key={f.title}
                variants={featureVariant}
              >
                <h5>{f.title}</h5>
                {/* <p>{f.desc}</p> */}
              </motion.div>
            ))}
          </motion.div>

          <motion.a
            href="#products"
            className="btn btn-dark"
            variants={buttonVariant}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Our Menu
          </motion.a>
        </div>
      </div>
    </motion.section>
  )
}
