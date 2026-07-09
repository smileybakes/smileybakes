import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Story from './components/Story.jsx'
import WhyChooseUs from './components/WhyChooseUs.jsx'
import Products from './components/Products.jsx'
import OotySpecials from './components/OotySpecials.jsx'
import CustomOrder from './components/CustomOrder.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'

// Scroll to the URL hash target (e.g. #contact) after arriving on the homepage.
// Needed because sections load async content (products/reviews from Supabase)
// that shifts the layout — the browser's initial hash jump fires too early and
// is lost, so we re-scroll as content settles until the target exists.
function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        clearInterval(timer)
      } else if (++tries > 20) {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])
}

export default function App() {
  useHashScroll()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Products />
        <OotySpecials />
        <WhyChooseUs />
        <CustomOrder />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
