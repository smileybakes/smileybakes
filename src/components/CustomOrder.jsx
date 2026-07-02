import { useState } from 'react'

const STEPS = [
  { n: '01', title: 'Submit Your Request', desc: 'Tell us the products, variants, and quantity you need' },
  { n: '02', title: 'Quick Confirmation', desc: 'Our team will call you within 24 hours to confirm pricing and details' },
  { n: '03', title: 'Fresh Batch Baking', desc: 'We bake your bulk order fresh in our kitchen' },
  { n: '04', title: 'Pickup or Delivery', desc: 'Collect from our shop or get it delivered to your doorstep' },
]

const VARIANTS = [
  'Sweet Varkey', 'Salt Varkey', 'Masala Varkey', 'Ghee Varkey',
  'Butter Cookies', 'Coconut Cookies', 'Jeera Cookies', 'Chocolate Cookies', 'Nankhatai',
]

// WhatsApp number in international format (no +, spaces or dashes). 91 = India.
const WHATSAPP_NUMBER = '916382102558'

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  productType: '',
  requiredDate: '',
  quantity: '',
  unit: '',
  purpose: '',
  deliveryMethod: '',
  deliveryAddress: '',
  instructions: '',
}

export default function CustomOrder() {
  const [variants, setVariants] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const toggle = (f) =>
    setVariants((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))

  const buildMessage = () => {
    const lines = [
      '*🍪 New Bulk Order Request*',
      '',
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      `*Email:* ${form.email}`,
      '',
      `*Product Type:* ${form.productType}`,
      `*Variants:* ${variants.length ? variants.join(', ') : '—'}`,
      `*Quantity:* ${form.quantity} ${form.unit}`,
      `*Required Date:* ${form.requiredDate}`,
    ]

    if (form.purpose) lines.push(`*Purpose:* ${form.purpose}`)

    lines.push('', `*Delivery Method:* ${form.deliveryMethod}`)
    if (form.deliveryMethod === 'Delivery' && form.deliveryAddress) {
      lines.push(`*Delivery Address:* ${form.deliveryAddress}`)
    }

    if (form.instructions) lines.push('', `*Special Instructions:* ${form.instructions}`)

    return lines.join('\n')
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!variants.length) {
      alert('Please select at least one product variant.')
      return
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="custom" id="custom-cakes">
      <div className="container custom-grid">
        {/* Left */}
        <div className="custom-intro">
          <span className="eyebrow gold-line">Bulk Orders</span>
          <h2 className="section-title">
            Varkey &amp; Cookies,
            <br />
            <span className="accent">Baked in Bulk</span>
          </h2>
          {/* <p className="custom-lead">
            Hosting an event or stocking up for a celebration? Order our crisp
            Varkey and freshly baked cookies in bulk. Tell us what you need, and
            our team will prepare your order with the same care that goes into
            every batch.
          </p> */}

          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* <img
            className="custom-img"
            src="https://t4.ftcdn.net/jpg/07/28/56/39/360_F_728563972_CCPevJI0rJSRjFYW10PF7CYdIjh2tCdI.jpg"
            alt="Assortment of freshly baked cookies"
          /> */}
        </div>

        {/* Right — form card */}
        <form className="inquiry-card" onSubmit={onSubmit}>
          <h3 className="inquiry-title">🍪 Bulk Order Inquiry</h3>

          <div className="field-row">
            <div className="field">
              <label>Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={update} placeholder="Jane Smith" required />
            </div>
            <div className="field">
              <label>Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="(310) 555-0100" required />
            </div>
          </div>

          <div className="field">
            <label>Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={update} placeholder="jane@email.com" required />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Product Type *</label>
              <select name="productType" value={form.productType} onChange={update} required>
                <option value="" disabled>Select…</option>
                <option>Varkey</option>
                <option>Cookies</option>
                <option>Both</option>
              </select>
            </div>
            <div className="field">
              <label>Required Date *</label>
              <input type="date" name="requiredDate" value={form.requiredDate} onChange={update} required />
            </div>
          </div>

          <div className="field">
            <label>Product Variants *</label>
            <div className="flavor-pills">
              {VARIANTS.map((f) => (
                <button
                  type="button"
                  key={f}
                  className={`pill ${variants.includes(f) ? 'active' : ''}`}
                  onClick={() => toggle(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Quantity Required *</label>
              <input type="number" name="quantity" value={form.quantity} onChange={update} min="1" placeholder="e.g. 50" required />
            </div>
            <div className="field">
              <label>Unit *</label>
              <select name="unit" value={form.unit} onChange={update} required>
                <option value="" disabled>Select…</option>
                <option>Packs</option>
                <option>Pieces</option>
                <option>Kg</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Purpose of Order</label>
            <select name="purpose" value={form.purpose} onChange={update}>
              <option value="" disabled>Select…</option>
              <option>Birthday</option>
              <option>Wedding</option>
              <option>Corporate</option>
              <option>Festival</option>
              <option>Party</option>
              <option>Other</option>
            </select>
          </div>

          <div className="field">
            <label>Delivery Method *</label>
            <select
              name="deliveryMethod"
              required
              value={form.deliveryMethod}
              onChange={update}
            >
              <option value="" disabled>Select…</option>
              <option> We pickup at shop</option>
              <option>Delivery</option>
            </select>
          </div>

          {form.deliveryMethod === 'Delivery' && (
            <div className="field">
              <label>Delivery Address *</label>
              <textarea name="deliveryAddress" value={form.deliveryAddress} onChange={update} rows="2" placeholder="Street, area, city, and pincode" required />
            </div>
          )}

          <div className="field">
            <label>Special Instructions</label>
            <textarea name="instructions" value={form.instructions} onChange={update} rows="2" placeholder="Mention preferred flavors, packaging preferences, allergy information, or any additional requirements." />
          </div>

          <button type="submit" className="btn btn-gold inquiry-submit">➤ Request Bulk Order</button>
          <p className="inquiry-foot">
            We respond within 24 hours. Bulk orders require advance notice for large quantities.
          </p>
        </form>
      </div>
    </section>
  )
}
