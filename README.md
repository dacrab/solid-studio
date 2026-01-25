# 🎨 Solid Studio

A modern, animated portfolio/agency website template built with SolidJS.

![SolidJS](https://img.shields.io/badge/SolidJS-2c4f7c?style=for-the-badge&logo=solid&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Modern Dark Theme** - Sleek, professional design
- **Smooth Animations** - Powered by solid-motionone
- **Projects Showcase** - Case studies with detailed views
- **Responsive Design** - Works on all devices
- **Lazy Loading** - Code-split pages for performance
- **Type Safe** - Full TypeScript support

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [SolidJS](https://www.solidjs.com/) | Reactive UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [TailwindCSS](https://tailwindcss.com/) | Styling |
| [solid-motionone](https://motion.dev/) | Animations |
| [@solidjs/router](https://docs.solidjs.com/solid-router) | Client-side routing |

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/dacrab/solid-studio.git
cd solid-studio

# Install dependencies
bun install

# Start development server
bun dev
```

### Build for Production

```bash
bun run build
bun run preview
```

## 📁 Project Structure

```
src/
├── App.tsx           # Main app with routing
├── index.tsx         # Entry point
├── index.css         # Global styles & Tailwind
├── data/
│   └── projects.ts   # Project data
├── components/
│   ├── Header.tsx    # Navigation header
│   ├── Hero.tsx      # Landing hero section
│   └── ProjectCard.tsx
└── pages/
    ├── Home.tsx      # Homepage
    └── Project.tsx   # Project detail page
```

## 🎯 Use Cases

- **Portfolio** - Showcase your work
- **Agency Website** - Present your services
- **Landing Page** - Product or service launch
- **Template** - Starting point for your project

## 📝 Customization

1. **Projects** - Edit `src/data/projects.ts` to add your own work
2. **Styling** - Modify `tailwind.config.js` and `index.css`
3. **Content** - Update text in components
4. **Branding** - Replace logos and colors

## 📄 License

MIT License - feel free to use this template for your own projects.

---

Built with ❤️ using [SolidJS](https://www.solidjs.com/)
