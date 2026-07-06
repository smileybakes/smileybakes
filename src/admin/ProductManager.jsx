import { useEffect, useMemo, useState } from 'react'
import {
  supabase,
  PRODUCT_IMAGE_BUCKET,
  PRODUCTS_TABLE,
  CATEGORIES_TABLE,
} from '../lib/supabase.js'
import { PLACEHOLDER, formatPrice } from '../data/products.js'
import ProductForm from './ProductForm.jsx'
import CategoryManager from './CategoryManager.jsx'
import { AdminTabs } from './Admin.jsx'

export default function ProductManager({ session, tabProps }) {
  const [products, setProducts] = useState([])
  const [dbCategories, setDbCategories] = useState([]) // rows from categories table
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // product object, {} for new, or null
  const [managingCats, setManagingCats] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    const [prodRes, catRes] = await Promise.all([
      supabase.from(PRODUCTS_TABLE).select('*').order('sort_order', { ascending: true }),
      supabase.from(CATEGORIES_TABLE).select('*').order('sort_order', { ascending: true }),
    ])
    setLoading(false)
    if (prodRes.error) setError(prodRes.error.message)
    else setProducts(prodRes.data ?? [])
    // Categories are non-fatal: fall back to product-derived list on error.
    if (catRes.error) console.error('Failed to load categories:', catRes.error.message)
    else setDbCategories(catRes.data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  // Selectable categories: the managed table list, plus any category a product
  // uses that isn't in the table yet (so existing products stay editable).
  const categories = useMemo(() => {
    const set = new Set(dbCategories.map((c) => c.name))
    products.forEach((p) => { if (p.category) set.add(p.category) })
    return Array.from(set)
  }, [dbCategories, products])

  // Apply category filter, then the free-text search (name or category).
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (filter !== 'All' && p.category !== filter) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [products, filter, search])

  async function toggleStatus(p) {
    const next = p.status === 'active' ? 'hidden' : 'active'
    // Optimistic update.
    setProducts((list) =>
      list.map((x) => (x.id === p.id ? { ...x, status: next } : x))
    )
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .update({ status: next })
      .eq('id', p.id)
    if (error) {
      setError(error.message)
      load() // revert to truth
    }
  }

  async function remove(p) {
    if (!confirm(`Delete “${p.name}”? This can’t be undone.`)) return
    const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', p.id)
    if (error) setError(error.message)
    else setProducts((list) => list.filter((x) => x.id !== p.id))
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="admin-app">
      {/* ---- Sticky header ---- */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <h1>Product Manager</h1>
            <span className="admin-user">{session.user?.email}</span>
          </div>
          {tabProps && <AdminTabs {...tabProps} />}
          <div className="app-header-actions">
            <button className="btn-ghost" onClick={() => setManagingCats(true)}>
              Manage categories
            </button>
            <button className="btn-primary" onClick={() => setEditing({})}>
              + Add product
            </button>
            <button className="btn-ghost" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="form-error wide-error">{error}</div>}

        {/* ---- Toolbar: search + category ---- */}
        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon" aria-hidden>
              ⌕
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="cat-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({products.filter((p) => p.category === c).length})
              </option>
            ))}
          </select>
        </div>

        <div className="result-count">
          {visible.length} {visible.length === 1 ? 'product' : 'products'}
        </div>

        {/* ---- Card grid ---- */}
        {loading ? (
          <div className="admin-card">Loading products…</div>
        ) : visible.length === 0 ? (
          <div className="admin-card empty-state">
            No products match{search || filter !== 'All' ? ' your filters' : ''}.
          </div>
        ) : (
          <div className="card-grid">
            {visible.map((p) => (
              <article
                key={p.id}
                className={`p-card ${p.status === 'hidden' ? 'is-hidden' : ''}`}
              >
                <div className="p-card-media">
                  <img
                    src={p.img || PLACEHOLDER}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== PLACEHOLDER)
                        e.currentTarget.src = PLACEHOLDER
                    }}
                  />
                  {!p.img && <span className="no-photo-tag">No photo</span>}
                  {p.badge && <span className="p-card-badge">{p.badge}</span>}
                </div>

                <div className="p-card-body">
                  <div className="p-card-cat">{p.category}</div>
                  <h3 className="p-card-name">{p.name}</h3>

                  <div className="p-card-meta">
                    <button
                      className={`status-pill ${p.status}`}
                      onClick={() => toggleStatus(p)}
                      title="Click to show / hide on the website"
                    >
                      {p.status === 'active' ? 'Active' : 'Hidden'}
                    </button>
                    {formatPrice(p) && (
                      <span className="price-tag">{formatPrice(p)}</span>
                    )}
                  </div>
                </div>

                <div className="p-card-actions">
                  <button
                    className="icon-btn"
                    onClick={() => setEditing(p)}
                    title="Edit"
                    aria-label={`Edit ${p.name}`}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={() => remove(p)}
                    title="Delete"
                    aria-label={`Delete ${p.name}`}
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
        <ProductForm
          product={editing}
          categories={categories}
          bucket={PRODUCT_IMAGE_BUCKET}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}

      {managingCats && (
        <CategoryManager
          categories={dbCategories}
          products={products}
          onClose={() => setManagingCats(false)}
          onChanged={load}
        />
      )}
    </div>
  )
}

// --- Inline icons (no external dependency) ---
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
