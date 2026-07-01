// Applies every .sql file in supabase/migrations/ in filename order.
// Migrations are written to be idempotent (add column if not exists, etc.),
// so re-running is safe.
//
// Usage:
//   1. Put your Supabase Postgres connection URI in .db-url.local
//   2. node scripts/db-migrate.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(root, 'supabase', 'migrations')

function readConnString() {
  try {
    const raw = readFileSync(join(root, '.db-url.local'), 'utf8').trim()
    if (!raw) throw new Error('empty')
    return raw
  } catch {
    console.error(
      'ERROR: .db-url.local not found or empty.\n' +
        'Create it with your Supabase connection URI, then re-run.'
    )
    process.exit(1)
  }
}

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

if (files.length === 0) {
  console.log('No migrations found.')
  process.exit(0)
}

const client = new pg.Client({
  connectionString: readConnString(),
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  for (const f of files) {
    const sql = readFileSync(join(migrationsDir, f), 'utf8')
    console.log(`Applying ${f} …`)
    await client.query(sql)
    console.log(`  ✓ ${f}`)
  }
  console.log('\nAll migrations applied.')
} catch (err) {
  console.error('\nMigration failed:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
