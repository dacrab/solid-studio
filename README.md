# Bureau — Brand & Digital, Berlin

Studio site for Bureau, an independent brand and digital studio for climate and deep tech companies. Jonas Ek and Mara Voss, Berlin.

Live: **https://solid-studio-zeta.vercel.app**

## Tech Stack

| Technology | Purpose |
|---|---|
| [SolidJS](https://www.solidjs.com/) | Reactive UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [TailwindCSS v4](https://tailwindcss.com/) | Styling (via `@tailwindcss/vite`, no PostCSS config needed) |
| [@solidjs/router](https://docs.solidjs.com/solid-router) | Client-side routing with lazy-loaded routes |
| [@solidjs/meta](https://github.com/solidjs/solid-meta) | Dynamic `<title>` and meta tags per page |

## Getting Started

```bash
bun install
bun dev
```

```bash
bun run build
bun run preview
```

## Project Structure

```
public/
├── robots.txt
└── sitemap.xml

src/
├── App.tsx              # Main page — hero, work, studio, approach, contact
├── index.tsx            # Entry point, router, Suspense, ErrorBoundary, MetaProvider
├── index.css            # Global styles & Tailwind
├── data/
│   └── projects.ts      # Project data, types, and getProjectBySlug()
└── pages/
    ├── ProjectPage.tsx  # Project detail — lazy loaded
    └── NotFound.tsx     # 404 — lazy loaded
```

## Solid Features Used

- `createSignal` — local reactive state (time, scroll, menu, image load)
- `createStore` — section visibility map (flat keyed object)
- `createMemo` — derived values that only recompute when deps change
- `createEffect` — side effects (body overflow lock, slug → project resolution)
- `onMount` / `onCleanup` — event listeners with guaranteed cleanup
- `batch` — group multiple signal writes into a single render
- `lazy` — code-split `ProjectPage` and `NotFound` into separate chunks
- `Suspense` — handles lazy component loading at the router level
- `ErrorBoundary` — catches render errors app-wide, shows on-brand fallback
- `Show` / `For` — conditional and list rendering
- `@solidjs/meta` — `MetaProvider`, `Title`, `Meta` for per-page SEO

## Projects

| Slug | Client | Type | Year |
|---|---|---|---|
| `solaris` | Solaris | Brand Identity | 2024 |
| `kin` | Kin | Digital Product | 2024 |
| `conductor` | Conductor | Brand & Web | 2023 |
| `havn` | Havn | Brand Identity | 2023 |

## Customization

1. **Projects** — Edit `src/data/projects.ts` (slugs, copy, images, results)
2. **Studio copy** — Edit `src/App.tsx` (constants at top of file)
3. **Styles** — Edit `src/index.css`
4. **SEO / meta** — Update URLs in `index.html` and `public/sitemap.xml`

## License

MIT
