import { motion, useTransform } from 'framer-motion'

/**
 * A single coverflow card.
 *
 * `position` is a (already spring-smoothed) MotionValue holding the carousel's
 * current fractional index. `index` is this card's own slot. The wrapped
 * difference (offset) drives all the 3D transforms.
 *
 * NB: we deliberately do NOT spring the individual transforms here. Springing
 * each property would animate across the seam when the offset wraps (e.g.
 * +half → -half), making a card fly across the screen on loop. Smoothing the
 * single `position` value upstream keeps motion fluid while the wrap stays
 * instantaneous.
 */
export default function CarouselItem({ review, index, position, count, onSelect }) {
  // Signed distance from the active center, wrapped to the nearest copy so the
  // carousel loops infinitely in both directions.
  const offset = useTransform(position, (p) => {
    let d = index - p
    d = ((d % count) + count) % count // normalize to [0, count)
    if (d > count / 2) d -= count // fold to [-count/2, count/2]
    return d
  })

  const cardW = 360
  const x = useTransform(offset, (o) => o * cardW * 0.7)
  const rotateY = useTransform(offset, (o) => Math.max(-55, Math.min(55, -o * 38)))
  const scale = useTransform(offset, (o) => Math.max(0.74, 1.12 - Math.abs(o) * 0.22))
  const z = useTransform(offset, (o) => -Math.abs(o) * 220)
  const opacity = useTransform(offset, (o) => Math.max(0, 1 - Math.abs(o) * 0.42))
  const blur = useTransform(offset, (o) => `blur(${Math.min(6, Math.abs(o) * 2.4)}px)`)
  const zIndex = useTransform(offset, (o) => 100 - Math.round(Math.abs(o) * 10))
  const pointerEvents = useTransform(offset, (o) => (Math.abs(o) < 0.5 ? 'auto' : 'none'))
  const shadowOpacity = useTransform(offset, (o) => (Math.abs(o) < 0.5 ? 1 : 0))

  return (
    <motion.article
      className="cf-card"
      style={{
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
        filter: blur,
        pointerEvents,
      }}
      onClick={() => onSelect?.(index)}
      whileHover={{ y: -8 }}
    >
      <div className="cf-card-inner">
        <div className="review-top">
          <span className="stars">★★★★★</span>
          <span className="quote-mark">&rdquo;</span>
        </div>
        <p className="review-text">{review.text}</p>
        <div className="review-author">
          {/* <img src={review.avatar} alt={review.name} loading="lazy" draggable="false" /> */}
          <div>
            <div className="ra-name">{review.name}</div>
            <div className="ra-role">{review.role}</div>
          </div>
        </div>
      </div>
      <motion.span
        className="cf-card-shadow"
        style={{ opacity: shadowOpacity }}
        aria-hidden="true"
      />
    </motion.article>
  )
}
