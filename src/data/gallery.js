// Smiley Bakes — gallery (bento grid).
//
// Live images come from the Supabase `gallery_images` table. This file provides
// a static fallback so the /gallery page still looks right before Supabase has
// any rows (or if the fetch fails). Every fallback tile uses the shared
// PLACEHOLDER photo for now — the admin swaps in real photos later via the
// Gallery tab in /admin.
import { PLACEHOLDER } from './products.js'

// Valid bento tile sizes and how each spans the grid (columns × rows).
// Kept in sync with the CSS in src/styles.css (.bento-*) and the DB check
// constraint in supabase/migrations/002_gallery.sql.
export const GALLERY_SIZES = [
  { value: 'small', label: 'Small (1×1)' },
  { value: 'wide', label: 'Wide (2×1)' },
  { value: 'tall', label: 'Tall (1×2)' },
  { value: 'large', label: 'Large (2×2)' },
]

// Static fallback layout — a pleasant mix of sizes, all sharing PLACEHOLDER.
export const GALLERY_PLACEHOLDERS = [
  { id: 'ph-1', img: PLACEHOLDER, caption: 'Freshly baked', size: 'large', sort_order: 0 },
  { id: 'ph-2', img: PLACEHOLDER, caption: '', size: 'small', sort_order: 1 },
  { id: 'ph-3', img: PLACEHOLDER, caption: '', size: 'tall', sort_order: 2 },
  { id: 'ph-4', img: PLACEHOLDER, caption: '', size: 'small', sort_order: 3 },
  { id: 'ph-5', img: PLACEHOLDER, caption: '', size: 'wide', sort_order: 4 },
  { id: 'ph-6', img: PLACEHOLDER, caption: '', size: 'small', sort_order: 5 },
  { id: 'ph-7', img: PLACEHOLDER, caption: '', size: 'small', sort_order: 6 },
  { id: 'ph-8', img: PLACEHOLDER, caption: '', size: 'wide', sort_order: 7 },
]
