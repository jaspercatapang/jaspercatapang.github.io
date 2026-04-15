/**
 * Reads PDFs in public/publications, counts words before References/Bibliography,
 * writes src/publicationReadingMinutes.json (path -> minutes at 200 wpm).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PDFParse } from 'pdf-parse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const pubDir = path.join(root, 'public', 'publications')
const outFile = path.join(root, 'src', 'publicationReadingMinutes.json')

const WPM = 200

const REF_PATTERNS = [
  /\n\s*(?:\d+\.?\s*)?References\s*\n/i,
  /\n\s*REFERENCES\s*\n/,
  /\n\s*Bibliography\s*\n/i,
  /\n\s*BIBLIOGRAPHY\s*\n/,
  /\n\s*Works [Cc]ited\s*\n/,
  /\n\s*Literature [Cc]ited\s*\n/,
  /\n\s*R[eé]f[eé]rences\s*\n/i,
]

function textBeforeReferences (full) {
  const normalized = full.replace(/\r\n/g, '\n')
  let cut = normalized.length
  for (const re of REF_PATTERNS) {
    const m = normalized.match(re)
    if (m && m.index !== undefined && m.index < cut) cut = m.index
  }
  return normalized.slice(0, cut)
}

function wordCount (s) {
  return s.replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length
}

function minutesFromWords (n) {
  if (n < 1) return null
  return Math.max(1, Math.ceil(n / WPM))
}

async function main () {
  if (!fs.existsSync(pubDir)) {
    console.warn('No public/publications directory; writing empty map.')
    fs.writeFileSync(outFile, '{}\n', 'utf8')
    return
  }
  const files = fs.readdirSync(pubDir).filter((f) => f.toLowerCase().endsWith('.pdf'))
  const map = {}
  for (const file of files.sort()) {
    const abs = path.join(pubDir, file)
    const key = `/publications/${file}`
    try {
      const buf = fs.readFileSync(abs)
      const parser = new PDFParse({ data: buf })
      const { text } = await parser.getText()
      await parser.destroy()
      const body = textBeforeReferences(text || '')
      const words = wordCount(body)
      const mins = minutesFromWords(words)
      if (mins != null) map[key] = mins
      console.log(`${key}: ${words} words → ${mins} min`)
    } catch (e) {
      console.warn(`${key}: skip (${e.message})`)
    }
  }
  fs.writeFileSync(outFile, `${JSON.stringify(map, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${outFile}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
