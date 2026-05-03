import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const base = path.join(__dirname, '..', 'public')

function list(dir) {
  return fs
    .readdirSync(path.join(base, dir))
    .filter((x) => !x.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))
}

const galleryFiles = list('gallery').filter((f) => f !== 'about-me.JPG')

const categoryFolders = {
  wedding: ['wedding', list('wedding')],
  'couples-family': ['Couples', list('Couples')],
  /** Folder name on disk; URLs use slug `baptism`. */
  baptism: ['vaptism', list('vaptism')],
  fashion: ['fashion', list('fashion')],
  portraits: ['portraits', list('portraits')],
  events: ['events', list('events')],
  advertisment: ['advertisment', list('advertisment')],
}

function toTsArray(arr) {
  return '[\n' + arr.map((s) => `  ${JSON.stringify(s)},`).join('\n') + '\n]'
}

let out =
  '/** Auto-generated from `public/**` — run: `node scripts/gen-image-lists.mjs` */\n\n'
out += 'export const galleryImageFilenames = ' + toTsArray(galleryFiles) + ' as const\n\n'

const order = [
  'wedding',
  'couples-family',
  'baptism',
  'fashion',
  'portraits',
  'events',
  'advertisment',
]
for (const key of order) {
  const name = key.replace(/-/g, '_') + '_files'
  const [, files] = categoryFolders[key]
  out += `export const ${name} = ` + toTsArray(files) + ' as const\n\n'
}

const outPath = path.join(__dirname, '..', 'data', 'generatedImageLists.ts')
fs.writeFileSync(outPath, out)
console.log('Wrote', outPath, 'gallery count:', galleryFiles.length)
