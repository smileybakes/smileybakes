import { useState } from 'react'
import { supabase, PRODUCTS_TABLE } from '../lib/supabase.js'

// Add / edit form shown in a modal. Handles image upload to Supabase Storage
// and insert/update of the product row.
export default function ProductForm({ product, categories, bucket, onClose, onSaved }) {
  const isNew = !product.id
  const [name, setName] = useState(product.name ?? '')
  const [category, setCategory] = useState(product.category ?? categories[0] ?? '')
  const [newCategory, setNewCategory] = useState('')
  const [badge, setBadge] = useState(product.badge ?? '')
  const [status, setStatus] = useState(product.status ?? 'active')
  const [img, setImg] = useState(product.img ?? '')
  const [sortOrder, setSortOrder] = useState(product.sort_order ?? 0)
  const [showPrice, setShowPrice] = useState(product.show_price ?? false)
  const [price, setPrice] = useState(
    product.price != null ? String(product.price) : ''
  )
  const [priceUnit, setPriceUnit] = useState(product.price_unit ?? 'kg')

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(file) {
    if (!file) return
    setError('')
    setUploading(true)
    // Unique filename so uploads never clash.
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const path = `${crypto.randomUUID()}-${safeName}`
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) {
      setUploading(false)
      setError(`Upload failed: ${upErr.message}`)
      return
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    setImg(data.publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const finalCategory = (newCategory.trim() || category).trim()
    if (!name.trim() || !finalCategory) {
      setError('Name and category are required.')
      return
    }
    // Price is optional. If "show price" is on, require a valid amount.
    const priceNum = price.trim() === '' ? null : Number(price)
    if (showPrice && (priceNum == null || Number.isNaN(priceNum) || priceNum < 0)) {
      setError('Enter a valid price, or turn off “Show price”.')
      return
    }

    setSaving(true)
    const payload = {
      name: name.trim(),
      category: finalCategory,
      badge: badge.trim() || null,
      img: img.trim() || null,
      status,
      price: priceNum,
      price_unit: priceNum == null ? null : priceUnit,
      show_price: showPrice,
      sort_order: Number(sortOrder) || 0,
    }

    const query = isNew
      ? supabase.from(PRODUCTS_TABLE).insert(payload)
      : supabase.from(PRODUCTS_TABLE).update(payload).eq('id', product.id)

    const { error } = await query
    setSaving(false)
    if (error) setError(error.message)
    else onSaved()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="admin-card modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{isNew ? 'Add product' : 'Edit product'}</h2>

        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <div className="form-row">
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            …or new category
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Leave blank to use selected"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Badge (optional)
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Seasonal"
            />
          </label>
          <label>
            Sort order
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </label>
        </div>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active (shown on website)</option>
            <option value="hidden">Hidden (not shown)</option>
          </select>
        </label>

        {/* ---- Pricing ---- */}
        <div className="price-field">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={showPrice}
              onChange={(e) => setShowPrice(e.target.checked)}
            />
            <span>Show price on website</span>
          </label>

          {showPrice && (
            <div className="form-row">
              <label>
                Price (₹)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 650"
                />
              </label>
              <label>
                Unit
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                >
                  <option value="kg">per kg</option>
                  <option value="piece">per piece</option>
                  <option value="pack">per pack</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="image-field">
          <label className="image-label">
            Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
          {uploading && <span className="muted">Uploading…</span>}
          {img && (
            <div className="image-preview">
              <img src={img} alt="preview" />
              <button
                type="button"
                className="btn-link danger"
                onClick={() => setImg('')}
              >
                Remove
              </button>
            </div>
          )}
          <label className="muted small">
            Or paste an image URL
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://…"
            />
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving || uploading}>
            {saving ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
