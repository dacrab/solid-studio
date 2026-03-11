# Outline° — Design Studio

A portfolio/agency website built with SolidJS.

## Tech Stack

| Technology | Purpose |
|---|---|
| [SolidJS](https://www.solidjs.com/) | Reactive UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [TailwindCSS](https://tailwindcss.com/) | Styling |
| [@solidjs/router](https://docs.solidjs.com/solid-router) | Client-side routing |

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
src/
├── App.tsx           # Main page (hero, work, about, services, contact)
├── index.tsx         # Entry point + routing
├── index.css         # Global styles & Tailwind
├── data/
│   └── projects.ts   # Project data and types
└── pages/
    └── ProjectPage.tsx  # Project detail page
```

## Customization

1. **Projects** — Edit `src/data/projects.ts`
2. **Content** — Update text directly in `App.tsx`
3. **Styles** — Modify `src/index.css`

## License

MIT
