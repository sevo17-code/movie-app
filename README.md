# CineScope

A modern movie discovery web app built with React and Vite, powered by TMDB API.

## Overview

CineScope delivers a cinematic browsing experience with smooth navigation, modern UI styling, and rich movie details.

## Features

- Trending and popular movie feeds
- Debounced search with infinite scroll
- Detailed movie pages (trailer, cast, similar movies)
- Watchlist with `localStorage` persistence
- Dark/Light theme toggle
- Page transitions using `framer-motion`
- Responsive layout for desktop and mobile
- GitHub Pages SPA fallback for direct route refreshes

## Tech Stack

- React 19
- Vite 8
- React Router
- Framer Motion
- TMDB API
- ESLint

## Project Structure

```text
src/
  components/        Reusable UI pieces
  context/           Theme + watchlist state
  hooks/             Custom hooks (debounce, fetch, infinite, localStorage)
  pages/             Route-level pages
  services/          API layer
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
VITE_TMDB_KEY=your_tmdb_api_key
```

### 3) Run development server

```bash
npm run dev
```

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Create production build in `dist`
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks
- `npm run deploy` - Deploy `dist` to GitHub Pages branch

## Deployment Notes

- The app is configured with:
  - `base: "/movie-app/"` in `vite.config.js`
  - `public/404.html` + redirect script in `index.html` for SPA route fallback on GitHub Pages

## Live Demo

- GitHub Pages: `https://sevo17-code.github.io/movie-app/`

## Author

- Sevo
