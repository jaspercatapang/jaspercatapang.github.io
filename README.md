# jaspercatapang.github.io

Personal portfolio built with **React** and **Tailwind CSS**. Hosted on [GitHub Pages](https://pages.github.com/).

**Live site:** [https://jaspercatapang.github.io](https://jaspercatapang.github.io)

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is written to the `docs/` folder (for GitHub Pages).

## Deploy to GitHub Pages

1. **Build the site:** `npm run build`
2. **Commit the `docs/` folder** (it contains the built static files).
3. In the repo: **Settings → Pages**
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**
5. **Branch:** `main` → **Folder:** `/docs` → Save

The site will be available at **https://jaspercatapang.github.io** after GitHub finishes publishing.
