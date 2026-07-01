// Shared Supabase client, used by both the public site and the admin app.
//
// Reads config from Vite env vars (see .env.example). The ANON key is safe to
// ship in the browser: Row Level Security (see supabase/schema.sql) restricts
// what it can actually do — the public site can only READ active products.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `isConfigured` lets the public site fall back to the bundled static list if
// env vars are missing (e.g. before Supabase is set up, or in a preview build).
export const isConfigured = Boolean(url && anonKey)

export const supabase = isConfigured ? createClient(url, anonKey) : null

export const PRODUCT_IMAGE_BUCKET = 'product-images'
