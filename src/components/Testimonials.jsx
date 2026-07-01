import { REVIEWS } from '../data/reviews.js'
import Carousel from './Carousel.jsx'

export default function Testimonials() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="reviews-head">
          <span className="eyebrow centered gold-only">Client Love</span>
          <h2 className="section-title">
            Words From Our <span className="accent">Community</span>
          </h2>
          <div className="reviews-rating">
            <span className="stars">★★★★★</span>
            {/* <span>4.6 out of 5 — 8+ Reviews</span> */}
          </div>
        </div>

        <Carousel items={REVIEWS} />

        <div className="google-badge">
          <div>
            <div className="gb-title">Google Reviews</div>
            <div className="gb-sub">8+ Reviews</div>
          </div>
          <div className="gb-score">4.6<span className="star">★</span></div>
        </div>
      </div>
    </section>
  )
}
