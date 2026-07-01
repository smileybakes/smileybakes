import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import CarouselItem from './CarouselItem.jsx'

const DRAG_PX_PER_CARD = 240 // how far you drag to advance one card

export default function Carousel({ items }) {
  const count = items.length

  // Raw target index (free-running, can grow past `count` — items wrap it).
  const target = useMotionValue(0)
  // Single spring that items actually read. Smoothing here (instead of per
  // transform inside each item) means a loop wrap never animates across the
  // seam — the card is simply already in its new slot.
  const position = useSpring(target, { stiffness: 220, damping: 30, mass: 0.7 })

  const dragStart = useRef(0)

  const go = (dir) => target.set(Math.round(target.get()) + dir)

  // Move to the nearest copy of `idx` (so clicking a side card advances by the
  // short way around the loop, not all the way back to an absolute index).
  const goToIndex = (idx) => {
    const cur = Math.round(target.get())
    let delta = ((idx - cur) % count + count) % count
    if (delta > count / 2) delta -= count
    target.set(cur + delta)
  }

  const handlePanStart = () => {
    dragStart.current = target.get()
  }

  const handlePan = (_e, info) => {
    target.set(dragStart.current - info.offset.x / DRAG_PX_PER_CARD)
  }

  const handlePanEnd = (_e, info) => {
    // Project momentum into card units, then snap to the nearest slot.
    const momentum = -info.velocity.x / DRAG_PX_PER_CARD
    target.set(Math.round(target.get() + momentum * 0.2))
  }

  return (
    <div className="cf-wrap">
      <motion.div
        className="cf-stage"
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="cf-track">
          {items.map((review, i) => (
            <CarouselItem
              key={review.name}
              review={review}
              index={i}
              count={count}
              position={position}
              onSelect={goToIndex}
            />
          ))}
        </div>
      </motion.div>

      <div className="cf-controls">
        <button className="cf-btn" onClick={() => go(-1)} aria-label="Previous review">
          ‹
        </button>
        <button className="cf-btn" onClick={() => go(1)} aria-label="Next review">
          ›
        </button>
      </div>
    </div>
  )
}
