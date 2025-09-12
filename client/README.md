### Plug-and-Play Blog and AI Feature Integrated Blog System — Frontend

Minimal React + Vite frontend for a plug-and-play blogging platform with admin tools and optional AI features. This app provides a fast SPA with routes for Home, Blog details, and an Admin dashboard (add/list blogs, manage comments, login).

#### Features
- **Home and Blog pages** with reusable UI components
- **Admin dashboard**: add/list blogs, review comments, login page
- **Theming** via `ThemeContext`
- **Optimized build** with Vite and ESLint setup

#### Tech Stack
- **React 18** with hooks
- **Vite** for dev/build/preview
- **ESLint** for code quality

#### Getting Started
1) Prerequisites: Node.js 18+ and npm
2) Install dependencies:
   ```bash
   npm install
   ```
3) Start dev server:
   ```bash
   npm run dev
   ```
4) Build for production:
   ```bash
   npm run build
   ```
5) Preview production build:
   ```bash
   npm run preview
   ```

#### Project Structure (key folders)
- `src/pages/` — route-level pages (e.g., `Home.jsx`, `Blog.jsx`, `pages/admin/*`)
- `src/components/` — UI components (including `components/admin/*`)
- `src/contexts/` — app-wide state (`ThemeContext.jsx`)
- `public/` — static assets

#### Configuration
- Environment variables (optional): configure backend/API base URL via Vite envs, e.g. create `.env` and use `VITE_API_BASE_URL` in code via `import.meta.env.VITE_API_BASE_URL`.

#### NPM Scripts
- `dev` — start Vite dev server
- `build` — build production assets
- `preview` — preview the production build

#### Code Quality
- ESLint is configured in `eslint.config.js`. Run your editor’s ESLint integration for best results.

