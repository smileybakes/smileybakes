import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Menu', href: '/#products' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Order Online', href: '/#custom-cakes' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Transparent over the hero photo; turns into the solid cream bar once the
  // user scrolls past the top.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll() // set initial state (e.g. reloaded mid-page)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="/#top" className="logo" onClick={() => setOpen(false)}>
          <img className="logo-img" src="/logo.png" alt="Smiley Bakes logo" />
          <div className="logo-text">
            <div className="logo-name">SMILEY</div>
            <div className="logo-sub">Bakes</div>
          </div>
        </a>

        <nav>
          <ul className={`nav-links ${open ? 'open' : ''}`}>
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <a href="/#custom-cakes" className="nav-order" onClick={() => setOpen(false)}>
            Order Online
          </a>
          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
