import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const TopRated = lazy(() => import("./pages/TopRated"));
const Explore = lazy(() => import("./pages/Explore"));
const RandomMovie = lazy(() => import("./pages/RandomMovie"));
const Compare = lazy(() => import("./pages/Compare"));
const WorldCinema = lazy(() => import("./pages/WorldCinema"));

function PageLoader() {
  const { t } = useTranslation();

  return (
    <div className="page-loader">
      <div className="pulse-dot" />
      <p>{t("loader_text")}</p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={`${location.pathname}${location.search}`}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails type="movie" />} />
        <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/top-movies" element={<TopRated type="movie" />} />
        <Route path="/top-series" element={<TopRated type="tv" />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/random" element={<RandomMovie />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/world-cinema" element={<WorldCinema />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
