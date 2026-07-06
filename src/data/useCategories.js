import { useEffect, useState } from 'react'
import { supabase, isConfigured, CATEGORIES_TABLE } from '../lib/supabase.js'
import { CATEGORIES as STATIC_CATEGORIES } from './products.js'

// Static list minus the synthetic 'All' — used as the fallback when Supabase
// isn't configured or the fetch fails.
const STATIC = STATIC_CATEGORIES.filter((c) => c !== 'All')

// Loads the admin-managed category list from Supabase. Returns category names
// in sort order. Falls back to the bundled static list so the UI always has
// something to show. Optionally merges in any categories that products use but
// that aren't in the table yet, so nothing silently disappears from filters.
export function useCategories({ mergeFromProducts } = {}) {
  const [categories, setCategories] = useState(STATIC)

  useEffect(() => {
    if (!isConfigured) return
    let cancelled = false
    supabase
      .from(CATEGORIES_TABLE)
      .select('name, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load categories:', error.message)
          return // keep static fallback
        }
        if (data && data.length) setCategories(data.map((c) => c.name))
      })
    return () => {
      cancelled = true
    }
  }, [])

  // On the storefront we merge in categories actually used by loaded products,
  // appended after the managed list, so a product never becomes unreachable.
  if (mergeFromProducts && mergeFromProducts.length) {
    const known = new Set(categories)
    const extra = []
    for (const p of mergeFromProducts) {
      if (p.category && !known.has(p.category)) {
        known.add(p.category)
        extra.push(p.category)
      }
    }
    if (extra.length) return [...categories, ...extra]
  }

  return categories
}
