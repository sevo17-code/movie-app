# CineScope

CineScope is a modern movie and TV discovery app built with React and Vite. It uses TMDB as the main content source and can optionally display IMDb ratings through OMDb on details pages.

Live demo: https://sevo17-code.github.io/movie-app/

## Features

- Trending and popular movie feeds
- Movie and TV search with infinite scrolling
- Details pages with trailers, cast, seasons, similar titles, TMDB ratings, and optional IMDb ratings
- Top-rated movies and top-rated series pages
- Genre exploration for movies and TV shows
- Random top-rated movie or series picker
- World cinema browsing by region
- Watchlist saved in `localStorage`
- Compare up to 3 selected titles
- Arabic and English language switcher
- Dark responsive UI with page transitions
- GitHub Pages SPA fallback for direct route refreshes

## Tech Stack

- React 19
- Vite 8
- React Router
- TanStack React Query
- Framer Motion
- React Helmet Async
- i18next
- TMDB API
- OMDb API
- ESLint

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root, next to `package.json`.

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
VITE_OMDB_KEY=your_omdb_api_key_here
```

`VITE_TMDB_KEY` is required for the app content.

`VITE_OMDB_KEY` is optional. IMDb ratings only appear on details pages when this key is available.

Vite only exposes variables that start with `VITE_`, so use `VITE_TMDB_KEY`, not `TMDB_KEY`.

After editing `.env`, restart the dev server.

You can test the TMDB key directly:

```text
https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY
```

### 3. Run locally

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create the production build in `dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy the `dist` folder to GitHub Pages |

## Project Structure

```text
src/
  components/        Shared UI components
  context/           Theme, watchlist, and compare state
  hooks/             Reusable React hooks
  pages/             Route-level pages
  services/          API helpers
```

## Deployment

The app is configured for GitHub Pages:

- `vite.config.js` uses `base: "/movie-app/"`
- `public/404.html` and the script in `index.html` support SPA route refreshes
- `npm run deploy` publishes the production build to the `gh-pages` branch

## Notes

- `.env` is ignored and should never be committed.
- `.env.example` documents the required variables without exposing real keys.
- `dist/`, `node_modules/`, and generated review/context files are excluded from Git.

## Author

Sevo
