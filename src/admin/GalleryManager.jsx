import { useEffect, useState } from 'react'
import { supabase, PRODUCT_IMAGE_BUCKET } from '../lib/supabase.js'
import { PLACEHOLDER } from '../data/products.js'
import GalleryForm from './GalleryForm.jsx'
import { AdminTabs } from './Admin.jsx'

// Manages the /gallery bento grid: upload images, set each one's tile size and
// order, show/hide, and delete. Mirrors ProductManager. Reuses the shared
// 'product-images' storage bucket for uploads.
export default function GalleryManager({ session, tabProps }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // image object, {} for new, or null

  async function load() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
    setLoading(false)
    if (error) setError(error.message)
    else setImages(data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleStatus(g) {
    const next = g.status === 'active' ? 'hidden' : 'active'
    setImages((list) =>
      list.map((x) => (x.id === g.id ? { ...x, status: next } : x))
    )
    const { error } = await supabase
      .from('gallery_images')
      .update({ status: next })
      .eq('id', g.id)
    if (error) {
      setError(error.message)
      load() // revert to truth
    }
  }

  async function remove(g) {
    if (!confirm('Delete this image? This can’t be undone.')) return
    const { error } = await supabase.from('gallery_images').delete().eq('id', g.id)
    if (error) setError(error.message)
    else setImages((list) => list.filter((x) => x.id !== g.id))
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Only active images shape the public grid — preview them the same way.
  const activeImages = images.filter((g) => g.status === 'active')

  return (
    <div className="admin-app">
      {/* ---- Sticky header ---- */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <h1>Gallery Manager</h1>
            <span className="admin-user">{session.user?.email}</span>
          </div>
          {tabProps && <AdminTabs {...tabProps} />}
          <div className="app-header-actions">
            <button className="btn-primary" onClick={() => setEditing({})}>
              + Add image
            </button>
            <button className="btn-ghost" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="form-error wide-error">{error}</div>}

        <div className="result-count">
          {images.length} {images.length === 1 ? 'image' : 'images'} ·{' '}
          {activeImages.length} shown on the site
        </div>

        {/* ---- Live bento preview (exactly how /gallery will look) ---- */}
        {activeImages.length > 0 && (
          <section className="gallery-preview">
            <h2 className="preview-title">Live preview</h2>
            <div className="bento-grid admin-bento">
              {activeImages.map((g) => (
                <figure key={g.id} className={`bento-tile bento-${g.size || 'small'}`}>
                  <img
                    src={g.img || PLACEHOLDER}
                    alt={g.caption || 'gallery image'}
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.classList.add('loaded')}
                    onError={(e) => {
                      if (e.currentTarget.src !== PLACEHOLDER)
                        e.currentTarget.src = PLACEHOLDER
                      else e.currentTarget.classList.add('loaded')
                    }}
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ---- Manage list ---- */}
        {loading ? (
          <div className="admin-card">Loading gallery…</div>
        ) : images.length === 0 ? (
          <div className="admin-card empty-state">
            No images yet. Click “+ Add image” to start building your gallery.
          </div>
        ) : (
          <div className="card-grid">
            {images.map((g) => (
              <article
                key={g.id}
                className={`p-card ${g.status === 'hidden' ? 'is-hidden' : ''}`}
              >
                <div className="p-card-media">
                  <img
                    src={g.img || PLACEHOLDER}
                    alt={g.caption || 'gallery image'}
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== PLACEHOLDER)
                        e.currentTarget.src = PLACEHOLDER
                    }}
                  />
                  {!g.img && <span className="no-photo-tag">No photo</span>}
                  <span className="p-card-badge">{sizeLabel(g.size)}</span>
                </div>

                <div className="p-card-body">
                  <div className="p-card-cat">Order {g.sort_order}</div>
                  <h3 className="p-card-name">{g.caption || 'Untitled image'}</h3>

                  <div className="p-card-meta">
                    <button
                      className={`status-pill ${g.status}`}
                      onClick={() => toggleStatus(g)}
                      title="Click to show / hide on the website"
                    >
                      {g.status === 'active' ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <div className="p-card-actions">
                  <button
                    className="icon-btn"
                    onClick={() => setEditing(g)}
                    title="Edit"
                    aria-label="Edit image"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={() => remove(g)}
                    title="Delete"
                    aria-label="Delete image"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {editing !== null && (
        <GalleryForm
          image={editing}
          bucket={PRODUCT_IMAGE_BUCKET}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </div>
  )
}

function sizeLabel(size) {
  return { small: '1×1', wide: '2×1', tall: '1×2', large: '2×2' }[size] || '1×1'
}

// --- Inline icons (shared look with ProductManager) ---
function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}
