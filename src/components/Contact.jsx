const ADDRESS = 'Rose Cottage, Ooty Main Road, Kotagiri, Tamil Nadu'
const MAP_Q = encodeURIComponent('Smiley Bakes, Ooty Main Road, Kotagiri, Tamil Nadu')

const Icon = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" /></svg>
  ),
}

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-head">
          <span className="eyebrow centered gold-only">Visit &amp; Contact</span>
          <h2 className="section-title">
            Come Find <span className="accent">Us</span>
          </h2>
          <p>Located in the heart of Kotagiri — a warm, fragrant sanctuary waiting to welcome you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="ci-row">
              <div className="ci-icon">{Icon.pin}</div>
              <div>
                <h4>Branch 1</h4>
                <p>Rose Cottage, Ooty Main Road<br />Kotagiri, Tamil Nadu</p>
                <p><a href="tel:+916382102558">+91 63821 02558</a></p>
              </div>
            </div>

            <div className="ci-row">
              <div className="ci-icon">{Icon.pin}</div>
              <div>
                <h4>Branch 2</h4>
                <p>Market Road, near old police station<br />Kotagiri, Tamil Nadu</p>
                <p><a href="tel:+919843800369">+91 98438 00369</a></p>
              </div>
            </div>

            <div className="ci-row">
              <div className="ci-icon">{Icon.mail}</div>
              <div>
                <h4>Email</h4>
                <p><a href="mailto:hello@smileybakes.com">hello@smileybakes.com</a></p>
              </div>
            </div>

            <div className="ci-row">
              <div className="ci-icon">{Icon.clock}</div>
              <div>
                <h4>Open</h4>
                <div className="ci-hours">
                  <div className="hr"><span>Everyday</span></div>
                </div>
              </div>
            </div>

            <div className="follow">
              <h4>Follow Us</h4>
              <div className="socials">
                <a className="social" href="#" aria-label="Instagram">{Icon.instagram}</a>
                <a className="social" href="#" aria-label="Facebook">{Icon.facebook}</a>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              title="Smiley Bakes location"
              src={`https://maps.google.com/maps?q=${MAP_Q}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-card">
              <h4>SMILEY BAKES</h4>
              <p>{ADDRESS}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAP_Q}`}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
