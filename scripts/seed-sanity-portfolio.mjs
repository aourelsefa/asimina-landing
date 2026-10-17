/**
 * Upload current public/ portfolio images into Sanity albums.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN  (create at sanity.io/manage → API → Tokens, Editor)
 *
 * Run: npm run seed:sanity
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'

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
  console.error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-04',
  token,
  useCdn: false,
})

function list(dir) {
  const full = path.join(publicDir, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((f) => !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))
}

function randomKey() {
  return `k${Math.random().toString(36).slice(2, 11)}`
}

async function uploadFile(filePath, filename) {
  const buffer = fs.readFileSync(filePath)
  return client.assets.upload('image', buffer, { filename })
}

async function buildPortfolioImages(folder, filenames) {
  const images = []
  for (const filename of filenames) {
    const filePath = path.join(publicDir, folder, filename)
    if (!fs.existsSync(filePath)) {
      console.warn(`  skip missing: ${folder}/${filename}`)
      continue
    }
    process.stdout.write(`  upload ${folder}/${filename}… `)
    const asset = await uploadFile(filePath, filename)
    console.log(asset._id)
    images.push({
      _key: randomKey(),
      _type: 'portfolioImage',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
  }
  return images
}

const categoryAlbums = [
  { id: 'wedding', folder: 'wedding', files: list('wedding') },
  { id: 'couples-family', folder: 'Couples', files: list('Couples') },
  { id: 'baptism', folder: 'vaptism', files: list('vaptism') },
  {
    id: 'fashion-portraits',
    folder: 'fashion+portraits',
    files: [...list('fashion'), ...list('portraits')],
    uploadFolder: (filename, fashionFiles, portraitFiles) =>
      fashionFiles.includes(filename) ? 'fashion' : 'portraits',
  },
  { id: 'events', folder: 'events', files: list('events') },
  { id: 'advertisment', folder: 'advertisment', files: list('advertisment') },
]

async function buildFashionPortraitImages() {
  const fashionFiles = list('fashion')
  const portraitFiles = list('portraits')
  const filenames = [...fashionFiles, ...portraitFiles]
  const images = []
  for (const filename of filenames) {
    const folder = fashionFiles.includes(filename) ? 'fashion' : 'portraits'
    const filePath = path.join(publicDir, folder, filename)
    process.stdout.write(`  upload ${folder}/${filename}… `)
    const asset = await uploadFile(filePath, filename)
    console.log(asset._id)
    images.push({
      _key: randomKey(),
      _type: 'portfolioImage',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
  }
  return images
}

async function main() {
  const galleryFiles = list('gallery').filter((f) => f.toLowerCase() !== 'about-me.jpg')

  console.log('\nMain gallery (%d files)…', galleryFiles.length)
  const galleryImages = await buildPortfolioImages('gallery', galleryFiles)
  await client.createOrReplace({
    _id: 'galleryAlbum',
    _type: 'galleryAlbum',
    title: 'Main gallery',
    images: galleryImages,
  })
  console.log('✓ galleryAlbum')

  for (const album of categoryAlbums) {
    if (album.id === 'fashion-portraits') {
      console.log('\nFashion & portraits (%d files)…', album.files.length)
      const images = await buildFashionPortraitImages()
      await client.createOrReplace({
        _id: `categoryAlbum-${album.id}`,
        _type: 'categoryAlbum',
        categoryId: album.id,
        images,
      })
      console.log(`✓ categoryAlbum-${album.id}`)
      continue
    }

    console.log('\n%s (%d files)…', album.id, album.files.length)
    const images = await buildPortfolioImages(album.folder, album.files)
    await client.createOrReplace({
      _id: `categoryAlbum-${album.id}`,
      _type: 'categoryAlbum',
      categoryId: album.id,
      images,
    })
    console.log(`✓ categoryAlbum-${album.id}`)
  }

  console.log('\nDone. Open http://localhost:3000/studio to review and publish.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
