import { useMemo, useState } from 'react'
import { supabase, PRODUCTS_TABLE, CATEGORIES_TABLE } from '../lib/supabase.js'

// Modal to add / remove categories. Deleting a category also deletes every
// product in it (confirmed first). Reflects on the site because the storefront
// filters read the same categories table + product rows.
export default function CategoryManager({ categories, products, onClose, onChanged }) {
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Count products per category name for the "…and N products" confirm.
  const counts = useMemo(() => {
    const map = {}
    for (const p of products) map[p.category] = (map[p.category] || 0) + 1
    return map
  }, [products])

  async function addCategory(e) {
    e.preventDefault()
    setError('')
    const name = newName.trim()
    if (!name) return
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setError(`“${name}” already exists.`)
      return
    }
    setBusy(true)
    // Place the new category after the current last one.
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order ?? 0), -1)
    const { error } = await supabase
      .from(CATEGORIES_TABLE)
      .insert({ name, sort_order: maxOrder + 1 })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setNewName('')
    onChanged()
  }

  async function deleteCategory(cat) {
    const count = counts[cat.name] || 0
    const msg =
      count > 0
        ? `Delete category “${cat.name}” and its ${count} product${count === 1 ? '' : 's'}? This can’t be undone.`
        : `Delete category “${cat.name}”? This can’t be undone.`
    if (!confirm(msg)) return

    setBusy(true)
    setError('')
    // Delete the products in this category first (cascade), then the category.
    if (count > 0) {
      const { error: prodErr } = await supabase
        .from(PRODUCTS_TABLE)
        .delete()
        .eq('category', cat.name)
      if (prodErr) {
        setBusy(false)
        setError(prodErr.message)
        return
      }
    }
    const { error: catErr } = await supabase
      .from(CATEGORIES_TABLE)
      .delete()
      .eq('id', cat.id)
    setBusy(false)
    if (catErr) {
      setError(catErr.message)
      return
    }
    onChanged()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-card modal" onClick={(e) => e.stopPropagation()}>
        <h2>Manage categories</h2>
        <p className="muted small" style={{ marginTop: '-4px' }}>
          Deleting a category also deletes all products in it.
        </p>

        <form className="cat-add-row" onSubmit={addCategory}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            aria-label="New category name"
          />
          <button type="submit" className="btn-primary" disabled={busy || !newName.trim()}>
            Add
          </button>
        </form>

        {error && <div className="form-error">{error}</div>}

        <ul className="cat-list">
          {categories.length === 0 && (
            <li className="muted">No categories yet — add one above.</li>
          )}
          {categories.map((c) => (
            <li key={c.id} className="cat-list-row">
              <span className="cat-list-name">{c.name}</span>
              <span className="cat-list-count">
                {counts[c.name] || 0} product{(counts[c.name] || 0) === 1 ? '' : 's'}
              </span>
              <button
                className="btn-link danger"
                onClick={() => deleteCategory(c)}
                disabled={busy}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
