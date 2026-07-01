import { useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase.js'
import Login from './Login.jsx'
import ProductManager from './ProductManager.jsx'

// Top-level admin app: shows the login screen until a user is authenticated,
// then the product manager. All write access is gated by Supabase Auth + RLS.
export default function Admin() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isConfigured) {
      setReady(true)
      return
    }
    // Existing session (e.g. page refresh) ...
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    // ... and react to login / logout.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isConfigured) {
    return (
      <div className="admin-shell">
        <div className="admin-card admin-notice">
          <h1>Setup needed</h1>
          <p>
            Supabase isn’t configured yet. Copy <code>.env.example</code> to{' '}
            <code>.env</code>, fill in your project URL and anon key, then
            restart the dev server. See <code>SUPABASE_SETUP.md</code>.
          </p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="admin-shell">
        <div className="admin-card">Loading…</div>
      </div>
    )
  }

  return session ? <ProductManager session={session} /> : <Login />
}
