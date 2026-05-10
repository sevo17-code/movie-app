import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const WatchlistContext = createContext(null);

const normalizeMovie = (movie) => ({
  id: movie.id,
  media_type: movie.media_type ?? (movie.first_air_date ? "tv" : "movie"),
  title: movie.title ?? movie.name ?? "Untitled",
  poster_path: movie.poster_path ?? null,
  backdrop_path: movie.backdrop_path ?? null,
  vote_average: movie.vote_average ?? 0,
  release_date: movie.release_date ?? "",
  first_air_date: movie.first_air_date ?? "",
  overview: movie.overview ?? "",
});

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useLocalStorage("movie_app_watchlist", []);

  const value = useMemo(() => {
    const getMediaType = (movie) => movie.media_type ?? (movie.first_air_date ? "tv" : "movie");

    const isInWatchlist = (movieOrId, maybeType = "movie") => {
      if (typeof movieOrId === "object" && movieOrId !== null) {
        const mediaType = getMediaType(movieOrId);
        return watchlist.some((movie) => movie.id === movieOrId.id && getMediaType(movie) === mediaType);
      }

      return watchlist.some((movie) => movie.id === movieOrId && getMediaType(movie) === maybeType);
    };

    const addToWatchlist = (movie) => {
      setWatchlist((prev) => {
        const mediaType = getMediaType(movie);
        if (prev.some((item) => item.id === movie.id && getMediaType(item) === mediaType)) return prev;
        return [normalizeMovie(movie), ...prev];
      });
    };

    const removeFromWatchlist = (movieOrId, maybeType = "movie") => {
      if (typeof movieOrId === "object" && movieOrId !== null) {
        const mediaType = getMediaType(movieOrId);
        setWatchlist((prev) =>
          prev.filter((movie) => !(movie.id === movieOrId.id && getMediaType(movie) === mediaType))
        );
        return;
      }

      setWatchlist((prev) =>
        prev.filter((movie) => !(movie.id === movieOrId && getMediaType(movie) === maybeType))
      );
    };

    const toggleWatchlist = (movie) => {
      if (isInWatchlist(movie)) {
        removeFromWatchlist(movie);
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
