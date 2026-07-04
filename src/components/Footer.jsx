export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo">
              <div className="logo-name">SMILEY</div>
              <div className="logo-sub">Bakes</div>
            </div>
            <p className="footer-about">
              Artisan cakes, breads &amp; desserts crafted with love and baked
              fresh every single day.
            </p>
          </div>

          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#products">Menu</a></li>
              <li><a href="#custom-cakes">Custom Cakes</a></li>
              <li><a href="#order">Order Online</a></li>
            </ul>
          </div>

          <div>
            <h5>Visit Us</h5>
            <ul>
              <li>Rose Cottage, Ooty Main Road, Kotagiri</li>
              <li>Market Road, near old police station, Kotagiri</li>
              <li>Open Everyday</li>
            </ul>
          </div>

          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+916382102558">+91 63821 02558</a></li>
              <li><a href="tel:+919843800369">+91 98438 00369</a></li>
              <li><a href="mailto:smileybakes.43@gmail.com">smileybakes.43@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Smiley Bakes. All rights reserved.</span>
          <span>Freshly Baked Happiness Every Day</span>
        </div>
      </div>
    </footer>
  )
}
