/**
 * Extracts Abstract sections from PDFs in public/publications.
 * Writes src/publicationAbstracts.json (pdfUrl path -> plain text).
 * Skips files where no Abstract block is detected.
 * Merges src/publicationAbstractOverrides.json last (curated text for preprints
 * or PDFs where layout lacks a clear Abstract heading).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PDFParse } from 'pdf-parse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const pubDir = path.join(root, 'public', 'publications')
const outFile = path.join(root, 'src', 'publicationAbstracts.json')
const overridesFile = path.join(root, 'src', 'publicationAbstractOverrides.json')

/**
 * Text after a section-style "Abstract" / "ABSTRACT" until a common following section.
 * Case-sensitive on "Abstract" so we do not match the word "abstract" inside phrases like
 * "abstract concepts" (a prior /\bAbstract/.../i false positive).
 */
function extractAbstract (raw) {
  const t = (raw || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\f/g, '\n')
  const header = /(?:^|\n)\s*(?:Abstract|ABSTRACT)\s*[.:—\-–]?\s*/
  const m = t.match(header)
  if (!m || m.index === undefined) return null
  let rest = t.slice(m.index + m[0].length)
  const endPatterns = [
    /\n\s*Keywords?\s*[:\n]/i,
    /\n\s*Key\s+words\s*[:\n]/i,
    /\n\s*Index Terms?\s*[:\n]/i,
    /\n\s*ACM\s+CCS\b/i,
    /\n\s*CCS\s+Concepts/i,
    /\n\s*Author Keywords/i,
    /\n\s*Categories and Subject Descriptors/i,
    /\n\s*Introduction\b/i,
    /\n\s*(?:1\.?\s+)?Introduction\b/i,
    /\n\s*I\.?\s+INTRODUCTION\b/,
    /\n\s*BACKGROUND\b/i,
    /\n\s*HIGHLIGHTS\b/i,
    /\n\s*RESUMO\b/i,
    /\n\s*RESUMEN\b/i,
  ]
  let end = rest.length
  for (const re of endPatterns) {
    const hit = rest.match(re)
    if (hit && hit.index !== undefined && hit.index < end) end = hit.index
  }
  let abstract = rest.slice(0, end).trim()
  abstract = abstract.replace(/-\s*\n\s*/g, '')
  abstract = abstract.replace(/\s*\n\s*/g, ' ')
  abstract = abstract.replace(/\s{2,}/g, ' ').trim()
  // JMIR / some publishers append page metadata on the same text stream
  abstract = abstract.replace(/\s*\(JMIR Form Res[^)]*\)\s*doi:\s*[^\s]+\s*/i, ' ')
  abstract = abstract.replace(/\s*JMIR FORMATIVE RESEARCH.*$/i, '')
  abstract = abstract.replace(/\s*XSL[•.]FO RenderX.*$/i, '')
  abstract = abstract.replace(/--\s*\d+\s+of\s+\d+\s+-/gi, ' ')
  abstract = abstract.replace(/\s{2,}/g, ' ').trim()
  if (abstract.length < 50) return null
  if (abstract.length > 12000) abstract = `${abstract.slice(0, 12000)}…`
  return abstract
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
      const extracted = extractAbstract(text || '')
      if (extracted) {
        map[key] = extracted
        console.log(`${key}: abstract (${extracted.length} chars)`)
      } else {
        console.warn(`${key}: no Abstract block found`)
      }
    } catch (e) {
      console.warn(`${key}: skip (${e.message})`)
    }
  }
  if (fs.existsSync(overridesFile)) {
    try {
      const overrides = JSON.parse(fs.readFileSync(overridesFile, 'utf8'))
      if (overrides && typeof overrides === 'object') {
        for (const [k, v] of Object.entries(overrides)) {
          if (typeof v === 'string' && v.trim().length > 0) {
            map[k] = v.trim()
            console.log(`${k}: abstract (override, ${v.trim().length} chars)`)
          }
        }
      }
    } catch (e) {
      console.warn(`Overrides file invalid or unreadable: ${e.message}`)
    }
  }
  fs.writeFileSync(outFile, `${JSON.stringify(map, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${outFile}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
