# Search & Google Search Console (after deploy)

Already in the repo:

- `public/robots.txt` → allows crawlers + points to the sitemap  
- `public/sitemap.xml` → homepage + CV URL  
- `index.html` → canonical URL, meta author/robots, Open Graph, **JSON-LD** (Person + WebSite)

## You still do (one time)

1. **Deploy** — push so `https://jaspercatapang.github.io/` is live with `robots.txt` and `sitemap.xml` at the root.

2. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console)  
   - Add property → **URL prefix** → `https://jaspercatapang.github.io/`  
   - **Verify** using one of:
     - **HTML tag**: copy the `content="…"` value Google gives you → in `index.html` uncomment the `google-site-verification` line and paste the token → rebuild (`npm run build`) → push.  
     - **HTML file**: download the file Google provides → save it in `public/` → build → push.

3. **Submit sitemap** — in Search Console: **Sitemaps** → add  
   `https://jaspercatapang.github.io/sitemap.xml`

4. **Request indexing** (optional) — **URL Inspection** → enter your homepage URL → **Request indexing**.

## Maintenance

- When you change the site meaningfully, update `<lastmod>` in `public/sitemap.xml` and rebuild.
