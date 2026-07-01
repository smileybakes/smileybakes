import { useState } from 'react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#products' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Order Online', href: '#custom-cakes' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="logo" onClick={() => setOpen(false)}>
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

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}
