/**
 * Sets missing categoryId on category albums from their document id
 * (e.g. categoryAlbum-wedding → wedding).
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 * Run: npm run fix:sanity-categories
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const CATEGORY_IDS = [
  'wedding',
  'couples-family',
  'baptism',
  'fashion-portraits',
  'events',
  'advertisment',
]

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-04',
  token,
  useCdn: false,
})

function categoryIdFromDocId(id) {
  const base = id.replace(/^drafts\./, '')
  if (!base.startsWith('categoryAlbum-')) return null
  const categoryId = base.slice('categoryAlbum-'.length)
  return CATEGORY_IDS.includes(categoryId) ? categoryId : null
}

async function main() {
  for (const categoryId of CATEGORY_IDS) {
    const docId = `categoryAlbum-${categoryId}`
    const doc = await client.fetch(`*[_id == $id][0]{ _id, categoryId }`, { id: docId })
    if (!doc) {
      console.log(`skip ${docId} (not created yet)`)
      continue
    }
    if (doc.categoryId === categoryId) {
      console.log(`ok ${docId}`)
      continue
    }
    await client.patch(docId).set({ categoryId }).commit()
    console.log(`fixed ${docId} → ${categoryId}`)
  }
  console.log('\nDone. Refresh Studio and publish again.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
