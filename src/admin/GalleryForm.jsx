import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { GALLERY_SIZES } from '../data/gallery.js'

// Add / edit form for a gallery image, shown in a modal. Handles image upload
// to Supabase Storage and insert/update of the gallery_images row. Mirrors
// ProductForm's upload flow.
export default function GalleryForm({ image, bucket, onClose, onSaved }) {
  const isNew = !image.id
  const [img, setImg] = useState(image.img ?? '')
  const [caption, setCaption] = useState(image.caption ?? '')
  const [size, setSize] = useState(image.size ?? 'small')
  const [status, setStatus] = useState(image.status ?? 'active')
  const [sortOrder, setSortOrder] = useState(image.sort_order ?? 0)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(file) {
    if (!file) return
    setError('')
    setUploading(true)
    // Unique filename so uploads never clash.
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const path = `gallery/${crypto.randomUUID()}-${safeName}`
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
    if (!img.trim()) {
      setError('Please upload an image or paste an image URL.')
      return
    }

    setSaving(true)
    const payload = {
      img: img.trim(),
      caption: caption.trim() || null,
      size,
      status,
      sort_order: Number(sortOrder) || 0,
    }

    const query = isNew
      ? supabase.from('gallery_images').insert(payload)
      : supabase.from('gallery_images').update(payload).eq('id', image.id)

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
        <h2>{isNew ? 'Add image' : 'Edit image'}</h2>

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

        <label>
          Caption (optional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Three-tier wedding cake"
          />
        </label>

        <div className="form-row">
          <label>
            Tile size
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              {GALLERY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
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
