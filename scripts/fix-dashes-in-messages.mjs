/**
 * Remove em dash (U+2014) and en dash (U+2013) from message strings.
 * Skips the root `about` object entirely (About Me copy).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'messages')

function fixString(s) {
  let out = s
  // Mid-sentence em dash with spaces → comma (readable, no long dash)
  out = out.replace(/\s\u2014\s/g, ', ')
  // En dash with spaces (NB typography)
  out = out.replace(/\s\u2013\s/g, ', ')
  // "word—word" tight (e.g. event—it's, people—the)
  out = out.replace(/([a-z.,])\u2014([a-z])/gi, (_, a, b) => `${a}. ${b}`)
  out = out.replace(/([a-z])\u2014([a-z])/gi, (_, a, b) => `${a}, ${b}`)
  // Remaining em/en dashes → comma
  out = out.replace(/\u2014/g, ', ')
  out = out.replace(/\u2013/g, ', ')
  // Clean double commas / ", ," typos from chaining
  out = out.replace(/,\s*,/g, ',')
  out = out.replace(/\s+,/g, ',')
  return out
}

function walk(obj, pathKeys) {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) {
    return obj.map((item, i) => walk(item, [...pathKeys, String(i)]))
  }
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const nextPath = [...pathKeys, key]
    if (key === 'about' && pathKeys.length === 0) {
      result[key] = value
      continue
    }
    if (typeof value === 'string') {
      result[key] = fixString(value)
    } else {
      result[key] = walk(value, nextPath)
    }
  }
  return result
}

for (const name of ['en.json', 'nb.json']) {
  const fp = path.join(root, name)
  const raw = fs.readFileSync(fp, 'utf8')
  const data = JSON.parse(raw)
  const fixed = walk(data, [])
  fs.writeFileSync(fp, JSON.stringify(fixed, null, 2) + '\n', 'utf8')
  console.log('Updated', fp)
}
