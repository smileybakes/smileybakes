// One-shot DB setup: runs supabase/schema.sql, then supabase/seed.sql (only if
// the products table is empty, so it's safe to re-run).
//
// Usage:
//   1. Put your Supabase Postgres connection URI in .db-url.local
//      (Project Settings -> Database -> Connection string -> URI).
//   2. node scripts/db-setup.mjs
//
// The connection string is read from the file and never printed.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function readConnString() {
  try {
    const raw = readFileSync(join(root, '.db-url.local'), 'utf8').trim()
    if (!raw) throw new Error('empty')
    return raw
  } catch {
    console.error(
      'ERROR: .db-url.local not found or empty.\n' +
        'Create it with your Supabase connection URI:\n' +
        "  echo 'postgresql://postgres.<ref>:<password>@<host>:5432/postgres' > .db-url.local"
    )
    process.exit(1)
  }
}

const schema = readFileSync(join(root, 'supabase', 'schema.sql'), 'utf8')
const seed = readFileSync(join(root, 'supabase', 'seed.sql'), 'utf8')

const client = new pg.Client({
  connectionString: readConnString(),
  // Supabase requires SSL; the pooler cert isn't in node's default CA bundle.
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  console.log('Connected. Running schema.sql …')
  await client.query(schema)
  console.log('  ✓ schema applied (table, RLS policies, storage bucket)')

  const { rows } = await client.query('select count(*)::int as n from public.products')
  if (rows[0].n > 0) {
    console.log(`  • products table already has ${rows[0].n} rows — skipping seed.`)
  } else {
    console.log('Seeding products …')
    await client.query(seed)
    const after = await client.query('select count(*)::int as n from public.products')
    console.log(`  ✓ seeded ${after.rows[0].n} products`)
  }

  console.log('\nDone. Database is ready.')
} catch (err) {
  console.error('\nDB setup failed:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
