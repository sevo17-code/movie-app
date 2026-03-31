import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const WatchlistContext = createContext(null);

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title ?? movie.name ?? "Untitled",
  poster_path: movie.poster_path ?? null,
  backdrop_path: movie.backdrop_path ?? null,
  vote_average: movie.vote_average ?? 0,
  release_date: movie.release_date ?? "",
  overview: movie.overview ?? "",
});

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useLocalStorage("movie_app_watchlist", []);

  const value = useMemo(() => {
    const isInWatchlist = (movieId) =>
      watchlist.some((movie) => movie.id === movieId);

    const addToWatchlist = (movie) => {
      setWatchlist((prev) => {
        if (prev.some((item) => item.id === movie.id)) return prev;
        return [normalizeMovie(movie), ...prev];
      });
    };

    const removeFromWatchlist = (movieId) => {
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    const toggleWatchlist = (movie) => {
      if (isInWatchlist(movie.id)) {
        removeFromWatchlist(movie.id);
      } else {
        addToWatchlist(movie);
      }
    };

    const clearWatchlist = () => setWatchlist([]);

    return {
      watchlist,
      count: watchlist.length,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      clearWatchlist,
    };
  }, [setWatchlist, watchlist]);

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}
