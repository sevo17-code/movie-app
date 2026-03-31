import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import useDebounce from "../hooks/useDebounce";
import useInfiniteMovies from "../hooks/useInfiniteMovies";
import { searchMovies } from "../services/api";
import "./SearchResults.css";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q")?.trim() ?? "";

  const [inputQuery, setInputQuery] = useState(queryParam);
  const debouncedQuery = useDebounce(inputQuery.trim(), 500);

  useEffect(() => {
    setInputQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (debouncedQuery === queryParam) return;
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, queryParam, setSearchParams]);

  const fetchSearchPage = useCallback(
    (page) => {
      if (!queryParam) {
        return Promise.resolve({ results: [], totalPages: 0, totalResults: 0 });
      }
      return searchMovies(queryParam, page);
    },
    [queryParam]
  );

  const { items, loading, error, hasMore, sentinelRef } = useInfiniteMovies(fetchSearchPage, {
    enabled: Boolean(queryParam),
    resetKey: queryParam,
  });

  const title = useMemo(() => {
    if (!queryParam) return "Search Movies";
    return `Results for "${queryParam}"`;
  }, [queryParam]);

  return (
    <PageTransition>
      <section className="search-page">
        <header className="search-header">
          <h1 className="section-title">{title}</h1>
          <p className="section-subtitle">
            Debounced search with infinite loading for smoother exploration.
          </p>
        </header>

        <div className="search-input-wrap">
          <input
            type="search"
            value={inputQuery}
            placeholder="Try: Dune, Interstellar, Joker..."
            onChange={(event) => setInputQuery(event.target.value)}
          />
        </div>

        {!queryParam ? (
          <div className="empty-state">Type a movie title to start searching.</div>
        ) : null}

        {error ? <div className="error-state">Could not complete search request.</div> : null}

        {loading && !items.length ? <SkeletonGrid count={10} /> : null}

        {!!items.length && (
          <div className="card-grid">
            {items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && queryParam && !items.length && !error ? (
          <div className="empty-state">No results found. Try another keyword.</div>
        ) : null}

        {loading && items.length > 0 ? <SkeletonGrid count={4} /> : null}

        <div ref={sentinelRef} className="infinite-sentinel" />
        {!hasMore && items.length > 0 ? <p className="feed-end">No more results.</p> : null}
      </section>
    </PageTransition>
  );
}

export default SearchResults;
