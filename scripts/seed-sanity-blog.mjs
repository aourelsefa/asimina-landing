/**
 * Seed existing blog posts from messages/en.json + public cover images into Sanity.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 *
 * Run: npm run seed:sanity-blog
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'

const blogPosts = [
  {
    slug: 'natural-light-wedding-photography-oslo',
    publishedAt: '2025-10-12',
    updatedAt: '2025-10-12',
    readTimeMinutes: 6,
    coverImage: { src: '/services/wedding-in-islo.jpg' },
  },
  {
    slug: 'baptism-family-photographer-norway',
    publishedAt: '2025-11-03',
    updatedAt: '2025-11-03',
    readTimeMinutes: 5,
    coverImage: { src: '/Couples/DSC_0016.jpg' },
  },
  {
    slug: 'authentic-portrait-photography-oslo',
    publishedAt: '2025-12-01',
    updatedAt: '2025-12-18',
    readTimeMinutes: 7,
    coverImage: { src: '/services/portrait-in-oslo.jpg' },
  },
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')

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
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-04',
  token,
  useCdn: false,
})

const enMessages = JSON.parse(fs.readFileSync(path.join(root, 'messages/en.json'), 'utf8'))
const nbMessages = JSON.parse(fs.readFileSync(path.join(root, 'messages/nb.json'), 'utf8'))

function keywordsToArray(value) {
  if (!value || typeof value !== 'string') return []
  return value.split('|').map((k) => k.trim()).filter(Boolean)
}

async function uploadCover(relativePath) {
  const filePath = path.join(publicDir, relativePath.replace(/^\//, ''))
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cover image not found: ${filePath}`)
  }
  const filename = path.basename(filePath)
  const buffer = fs.readFileSync(filePath)
  return client.assets.upload('image', buffer, { filename })
}

async function seedPost(meta) {
  const slug = meta.slug
  const en = enMessages.blog.posts[slug]
  const nb = nbMessages.blog.posts?.[slug]

  if (!en) {
    console.warn(`Skipping ${slug}: no English content in messages/en.json`)
    return
  }

  const asset = await uploadCover(meta.coverImage.src)
  const publishedAt = `${meta.publishedAt}T12:00:00.000Z`
  const updatedAt = `${meta.updatedAt}T12:00:00.000Z`

  const doc = {
    _id: `blogPost-${slug}`,
    _type: 'blogPost',
    slug: { _type: 'slug', current: slug },
    publishedAt,
    updatedAt,
    readTimeMinutes: meta.readTimeMinutes,
    featured: true,
    title: {
      en: en.title,
      nb: nb?.title || '',
    },
    excerpt: {
      en: en.excerpt,
      nb: nb?.excerpt || '',
    },
    metaDescription: {
      en: en.metaDescription,
      nb: nb?.metaDescription || '',
    },
    keywords: {
      en: keywordsToArray(en.keywords),
      nb: keywordsToArray(nb?.keywords),
    },
    coverAlt: {
      en: en.coverAlt,
      nb: nb?.coverAlt || '',
    },
    bodyHtml: {
      en: en.bodyHtml,
      nb: nb?.bodyHtml || '',
    },
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: {
        en: en.coverAlt,
        nb: nb?.coverAlt || '',
      },
    },
  }

  await client.createOrReplace(doc)
  console.log(`Seeded blog post: ${slug}`)
}

async function main() {
  for (const meta of blogPosts) {
    await seedPost(meta)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
