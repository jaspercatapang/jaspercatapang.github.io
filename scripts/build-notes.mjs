/**
 * Builds the Notes section from posts/*.md into static pages under public/notes/
 * (Vite copies public/ into docs/ on build).
 *
 *   public/notes/index.html          list of notes
 *   public/notes/<slug>/index.html   one page per note
 *   public/notes/feed.xml            RSS feed
 *   public/sitemap.xml               entries between the notes:start / notes:end markers
 *
 * Post format: a front-matter block (title, date, tags, summary, files) followed by Markdown.
 * Supported Markdown: ## / ### headings, paragraphs, - and 1. lists, > quotes, ``` code fences,
 * --- rules, and inline **bold**, *italic*, `code`, [text](url).
 * Each files entry reads "path | label | note" and the path is relative to public/notes/.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import katex from 'katex'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const postsDir = path.join(root, 'posts')
const outDir = path.join(root, 'public', 'notes')
const sitemapFile = path.join(root, 'public', 'sitemap.xml')
const SITE = 'https://jaspercatapang.github.io'
const NAME = 'Jasper Kyle Catapang'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function parsePost (file) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8').replace(/\r\n/g, '\n')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) throw new Error(`${file}: missing front matter`)
  const meta = { files: [] }
  let key = null
  for (const line of m[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/)
    if (item && key === 'files') {
      const [p, label, note = ''] = item[1].split('|').map((x) => x.trim())
      if (!p || !label) throw new Error(`${file}: bad files entry "${item[1]}"`)
      meta.files.push({ path: p, label, note })
      continue
    }
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) { key = kv[1]; if (key !== 'files') meta[key] = kv[2].trim() }
  }
  for (const k of ['title', 'date', 'summary']) if (!meta[k]) throw new Error(`${file}: missing ${k}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must be YYYY-MM-DD`)
  meta.tags = (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
  meta.slug = file.replace(/\.md$/, '')
  meta.body = m[2].trim()
  meta.minutes = Math.max(1, Math.ceil(m[2].replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length / 200))
  return meta
}

let mathUsed = false
let anyMath = false

function renderMath (tex, display) {
  mathUsed = true
  return katex.renderToString(tex, { displayMode: display, throwOnError: true })
}

function inline (text) {
  // Code spans and math are lifted out first so their contents are never touched by the other rules.
  const codes = []
  const maths = []
  let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(esc(c)); return `\u0000${codes.length - 1}\u0000` })
  // $...$ is math only when it hugs its content and is not followed by a digit, so "$5 and $10" stays prose.
  s = s.replace(/\$([^\s$](?:[^$\n]*[^\s$])?)\$(?!\d)/g, (_, tex) => { maths.push(renderMath(tex, false)); return `\u0001${maths.length - 1}\u0001` })
  s = esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const external = /^https?:/.test(u)
    return `<a href="${u}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${t}</a>`
  })
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  return s
    .replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[Number(i)]}</code>`)
    .replace(/\u0001(\d+)\u0001/g, (_, i) => maths[Number(i)])
}

function markdown (src) {
  const lines = src.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.startsWith('```')) {
      const buf = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`)
      continue
    }
    if (line.trim().startsWith('$$')) {
      const buf = [line.trim().slice(2)]
      while (!/\$\$\s*$/.test(buf[buf.length - 1]) && i + 1 < lines.length) buf.push(lines[++i])
      i++
      const tex = buf.join('\n').replace(/\$\$\s*$/, '').trim()
      out.push(`<div class="math">${renderMath(tex, true)}</div>`)
      continue
    }
    const h = line.match(/^(#{2,3})\s+(.*)$/)
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue }
    if (/^---+$/.test(line.trim())) { out.push('<hr>'); i++; continue }
    if (line.startsWith('>')) {
      const buf = []
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''))
      out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`)
      continue
    }
    const list = line.match(/^(-|\d+\.)\s+/)
    if (list) {
      const tag = list[1] === '-' ? 'ul' : 'ol'
      const items = []
      while (i < lines.length && /^(-|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^(-|\d+\.)\s+/, ''))
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</${tag}>`)
      continue
    }
    const buf = []
    while (i < lines.length && lines[i].trim() && !/^(```|\$\$|#{2,3}\s|>|---+$|-\s|\d+\.\s)/.test(lines[i])) buf.push(lines[i++])
    out.push(`<p>${inline(buf.join(' '))}</p>`)
  }
  return out.join('\n')
}

const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const fmtSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`)

function sunPath () {
  let d = ''
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 8.15 : 5.35
    const a = i * (Math.PI / 8) - Math.PI / 2
    d += `${i === 0 ? 'M' : 'L'}${(12 + r * Math.cos(a)).toFixed(3)},${(12 + r * Math.sin(a)).toFixed(3)}`
  }
  return `${d}Z`
}
const MOON = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap" rel="stylesheet">'

const THEME_INIT = `<script>(function(){try{if(localStorage.getItem('portfolio-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()</script>`

const THEME_TOGGLE = `<button type="button" class="theme" id="theme" aria-label="Switch theme"><svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="${MOON}" fill="currentColor"/></svg><svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><path d="${sunPath()}" fill="currentColor"/></svg></button>`

const THEME_JS = `<script>(function(){var b=document.getElementById('theme'),r=document.documentElement,m=document.getElementById('theme-color-meta');function sync(){var d=r.classList.contains('dark');b.setAttribute('aria-pressed',d);b.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');if(m)m.setAttribute('content',d?'#161616':'#ffffff')}b.addEventListener('click',function(){var d=r.classList.toggle('dark');try{localStorage.setItem('portfolio-theme',d?'dark':'light')}catch(e){}sync()});sync()})()</script>`

function page ({ title, description, canonical, type, ogTitle, body, extraHead = '', extraScript = '', navLink }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${NAME}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate" type="application/rss+xml" title="Notes · ${NAME}" href="/notes/feed.xml">
<meta name="theme-color" content="#ffffff" id="theme-color-meta">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/notes/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/notes/og.png">
${extraHead}${THEME_INIT}
${FONTS}
<link rel="stylesheet" href="/notes/notes.css">
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>
<header class="bar"><div class="bar-inner">
<a href="/" aria-label="${NAME}, back to portfolio"><img src="/professional_headshot.jpeg?v=2" alt="" width="32" height="32"></a>
<a class="who" href="/">${NAME}<small>Notes</small></a>
<span class="sp"></span>
${navLink}
${THEME_TOGGLE}
</div></header>
<main id="main" tabindex="-1">
${body}
</main>
<footer><div class="in"><span>&copy; ${NAME}</span><a href="/notes/">All notes</a><a href="/notes/feed.xml">RSS</a><span class="sp"></span><a href="/">Back to portfolio</a></div></footer>
${THEME_JS}${extraScript}
</body>
</html>
`
}

function chips (tags) {
  return tags.length ? `<div class="chips">${tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>` : ''
}

function postPage (p, newer, older) {
  const files = p.files.length
    ? `<aside class="files" aria-labelledby="files-h"><h2 id="files-h">Files</h2><ul>${p.files.map((f) => {
        const disk = path.join(outDir, f.path)
        if (!fs.existsSync(disk)) throw new Error(`${p.slug}: file not found: public/notes/${f.path}`)
        return `<li><a href="/notes/${esc(f.path)}"${f.path.endsWith('.pdf') ? ' target="_blank" rel="noopener noreferrer"' : ' download'}>${esc(f.label)}</a> <span class="meta">${esc(f.note ? `${f.note} · ` : '')}${fmtSize(fs.statSync(disk).size)}</span></li>`
      }).join('')}</ul></aside>`
    : ''
  const nav = (newer || older)
    ? `<nav class="postnav" aria-label="More notes"><span>${older ? `<a href="/notes/${older.slug}/">&larr; ${esc(older.title)}</a>` : ''}</span><span>${newer ? `<a href="/notes/${newer.slug}/">${esc(newer.title)} &rarr;</a>` : ''}</span></nav>`
    : ''
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.summary,
    datePublished: p.date,
    mainEntityOfPage: `${SITE}/notes/${p.slug}/`,
    author: { '@type': 'Person', name: NAME, url: `${SITE}/` },
    keywords: p.tags.join(', '),
  }
  mathUsed = false
  const prose = markdown(p.body)
  const hasMath = mathUsed
  anyMath = anyMath || hasMath
  const body = `<article>
<header>
<p class="label"><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="dot">&middot;</span>${p.minutes} min read</p>
<h1>${esc(p.title)}</h1>
${chips(p.tags)}
</header>
<div class="prose">
${prose}
</div>
${files}
${nav}
</article>`
  return page({
    title: `${p.title} · Notes · ${NAME}`,
    description: p.summary,
    canonical: `${SITE}/notes/${p.slug}/`,
    type: 'article',
    ogTitle: p.title,
    body,
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n${hasMath ? '<link rel="stylesheet" href="/notes/katex/katex.min.css">\n' : ''}`,
    navLink: '<a class="nav" href="/notes/">All notes</a>',
  })
}

function indexPage (posts) {
  const allTags = [...new Set(posts.flatMap((p) => p.tags))]
  const filter = posts.length > 1 && allTags.length > 1
    ? `<div class="chips" role="group" aria-label="Filter by topic" id="filter" style="padding-top:1.5rem"><button type="button" class="chip" data-tag="" aria-pressed="true">All</button>${allTags.map((t) => `<button type="button" class="chip" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</div>`
    : ''
  const list = posts.length
    ? `<ol class="timeline" aria-label="Notes">${posts.map((p) => `<li data-tags="${esc(p.tags.join('|'))}">
<p class="label"><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="dot">&middot;</span>${p.minutes} min read</p>
<h2><a href="/notes/${p.slug}/">${esc(p.title)}</a></h2>
<p>${esc(p.summary)}</p>
${chips(p.tags)}
</li>`).join('\n')}</ol>`
    : '<p class="empty">Nothing here yet.</p>'
  const script = filter
    ? `<script>(function(){var f=document.getElementById('filter');f.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var t=b.getAttribute('data-tag');f.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});document.querySelectorAll('.timeline li').forEach(function(li){li.hidden=t&&li.getAttribute('data-tags').split('|').indexOf(t)<0})})})()</script>`
    : ''
  const body = `<section class="intro">
<h1>Notes</h1>
<p>Short pieces on language models, code-switching and World Englishes. Smaller than a paper, with the working attached where there is any.</p>
${filter}
</section>
${list}`
  return page({
    title: `Notes · ${NAME}`,
    description: `Short notes by ${NAME} on language models, code-switching and World Englishes.`,
    canonical: `${SITE}/notes/`,
    type: 'website',
    ogTitle: `Notes · ${NAME}`,
    body,
    extraScript: script,
    navLink: '<a class="nav" href="/">Portfolio</a>',
  })
}

function feed (posts) {
  const items = posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/notes/${p.slug}/</link><guid isPermaLink="true">${SITE}/notes/${p.slug}/</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Notes · ${NAME}</title>
<link>${SITE}/notes/</link>
<description>Short notes on language models, code-switching and World Englishes.</description>
<language>en</language>
${items}
</channel></rss>
`
}

function updateSitemap (posts) {
  const entries = [
    { loc: `${SITE}/notes/`, lastmod: posts[0]?.date, priority: '0.7' },
    ...posts.map((p) => ({ loc: `${SITE}/notes/${p.slug}/`, lastmod: p.date, priority: '0.7' })),
  ].map((e) => `  <url>\n    <loc>${e.loc}</loc>\n${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ''}    <changefreq>monthly</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`).join('\n')
  const block = `  <!-- notes:start -->\n${entries}\n  <!-- notes:end -->`
  let xml = fs.readFileSync(sitemapFile, 'utf8')
  if (!/<!-- notes:start -->[\s\S]*<!-- notes:end -->/.test(xml)) throw new Error('sitemap.xml is missing the notes:start / notes:end markers')
  xml = xml.replace(/ *<!-- notes:start -->[\s\S]*<!-- notes:end -->/, block)
  fs.writeFileSync(sitemapFile, xml)
}

const posts = fs.readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .map(parsePost)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)))

// Remove stale generated post folders (the hand-written notes.css and files/ are kept).
for (const d of fs.readdirSync(outDir, { withFileTypes: true })) {
  if (d.isDirectory() && d.name !== 'files' && d.name !== 'katex' && !posts.some((p) => p.slug === d.name)) fs.rmSync(path.join(outDir, d.name), { recursive: true })
}
fs.writeFileSync(path.join(outDir, 'index.html'), indexPage(posts))
fs.writeFileSync(path.join(outDir, 'feed.xml'), feed(posts))
posts.forEach((p, i) => {
  fs.mkdirSync(path.join(outDir, p.slug), { recursive: true })
  fs.writeFileSync(path.join(outDir, p.slug, 'index.html'), postPage(p, posts[i - 1], posts[i + 1]))
})
updateSitemap(posts)

// KaTeX stylesheet and its woff2 fonts, copied from the installed package so they match the renderer.
const katexOut = path.join(outDir, 'katex')
fs.rmSync(katexOut, { recursive: true, force: true })
if (anyMath) {
  const dist = path.join(root, 'node_modules', 'katex', 'dist')
  fs.mkdirSync(path.join(katexOut, 'fonts'), { recursive: true })
  fs.copyFileSync(path.join(dist, 'katex.min.css'), path.join(katexOut, 'katex.min.css'))
  for (const f of fs.readdirSync(path.join(dist, 'fonts')).filter((x) => x.endsWith('.woff2'))) {
    fs.copyFileSync(path.join(dist, 'fonts', f), path.join(katexOut, 'fonts', f))
  }
}
console.log(`Notes: ${posts.length} post(s) written to public/notes/`)
