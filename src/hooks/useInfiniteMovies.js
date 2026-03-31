import { useCallback, useEffect, useRef, useState } from "react";

const mergeUniqueById = (current, incoming) => {
  const seen = new Set(current.map((movie) => movie.id));
  const merged = [...current];

  incoming.forEach((movie) => {
    if (!seen.has(movie.id)) {
      merged.push(movie);
      seen.add(movie.id);
    }
  });

  return merged;
};

function useInfiniteMovies(fetchPage, options = {}) {
  const { enabled = true, resetKey = "default" } = options;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setError(null);
    setHasMore(true);
  }, [resetKey]);

  useEffect(() => {
    if (!enabled || !hasMore) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = await fetchPage(page);
        if (cancelled) return;

        const pageItems = payload?.results ?? [];
        const totalPages = payload?.totalPages ?? 1;

        setItems((prev) =>
          page === 1 ? pageItems : mergeUniqueById(prev, pageItems)
        );
        setHasMore(page < totalPages && pageItems.length > 0);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [enabled, fetchPage, hasMore, page]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !enabled) return;
    setPage((prev) => prev + 1);
  }, [enabled, hasMore, loading]);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [enabled, loadMore, items.length]);

  return {
    items,
    loading,
    error,
    hasMore,
    sentinelRef,
    loadMore,
    reset: () => {
      setItems([]);
      setPage(1);
      setError(null);
      setHasMore(true);
    },
  };
}

export default useInfiniteMovies;
