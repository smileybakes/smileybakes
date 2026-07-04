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

export default function App() {
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
    </>
  )
}
