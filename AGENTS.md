# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:4321)
npm run build      # Build static site to dist/
npm run preview    # Preview the built dist/ locally
```

No test suite or linter is configured. Run `npm run build` before committing to catch schema/content errors early.

## Tech Stack

- **Astro 5** — static site generator, handles routing and content collections
- **Tailwind CSS** — styling (`tailwind.config.mjs`)
- **React** (islands only) — used for `PhotoGallery.tsx` (lazy loading + lightbox)
- **framer-motion / GSAP** — animations
- **Cloudflare R2** — photo storage (S3-compatible); gallery images are not in the repo

## Project Architecture

### i18n Strategy

The site is **bilingual (zh-TW / en)** but uses a non-URL-based approach — there is no `/en/` route prefix. Language is stored in `localStorage` under the key `hmsstc-lang` and applied client-side via `i18nClientScript` (exported from `src/i18n/translations.ts`).

- **UI strings**: Add to the `translations` object in `src/i18n/translations.ts` and reference via `data-i18n="key"` HTML attributes. The client-side script in `BaseLayout.astro` applies all translations on load and language switch.
- **Content (Markdown)**: Bilingual via file pairs — `slug.md` (Chinese, default) and `slug.en.md` (English). Each `[slug].astro` page loads both entries and renders them in sibling `<div data-lang-content="zh-TW">` / `<div data-lang-content="en">` blocks, toggled by CSS `display`.
- **Page titles**: Use the `<meta name="dynamic-title" data-zh="..." data-en="...">` pattern when a page needs a bilingual `<title>` tag.

### Content Collections (`src/content/config.ts`)

| Collection | Type | File format | Notes |
|---|---|---|---|
| `news` | content | `.md` / `.en.md` | `category`: `news` \| `announcement` |
| `missions` | content | `.md` / `.en.md` | `status`: `active` \| `retired`; `order` for sort |
| `activities` | content | `.md` / `.en.md` | |
| `members` | content | `.md` / `.en.md` | `category`: `regular` \| `advisory`; `order` for sort |
| `pages` | content | `.zh-TW.md` / `.en.md` | Static pages (about, contact) |
| `gallery` | data | `.yml` | R2 photo URLs; `folders` for sub-albums |

Content images referenced in Frontmatter (`image: "../images/..."`) are processed by Astro's image optimization pipeline at build time. External R2 URLs (strings) bypass optimization.

### Pages & Routing

All routes are static (`getStaticPaths`). Dynamic pages:
- `/news/[slug]`, `/missions/[slug]`, `/activities/[slug]`, `/members/[slug]` — filter out `.en.md` entries to generate slugs, then pass both `entry` and `translatedEntry` as props
- `/gallery/[album]` — album id from `.yml` filename

### Photo Gallery (Cloudflare R2)

Gallery images live in R2, not the repo. The upload tool compresses to WebP and writes R2 URLs into the album YAML:

```bash
# Requires .env with R2 credentials (see README §10)
node tools/upload-photos.mjs [album-name]
```

After uploading, commit the updated `src/content/gallery/*.yml` files. The `photos/` directory is gitignored.

### Layout & Components

- `src/layouts/BaseLayout.astro` — wraps all pages; injects Header, Footer, global CSS, and the i18n client script
- `src/components/Header.astro` — nav with lang switch (calls `window.__setLang()`)
- `src/components/PhotoGallery.tsx` — React island for lazy-loading images + lightbox

### Environment Variables (`.env`, not committed)

Required only for the upload tool:
```
CLOUDFLARE_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_ENDPOINT
R2_BUCKET_NAME
R2_PUBLIC_URL
```
