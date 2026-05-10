import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import useDebounce from "../hooks/useDebounce";
import { searchMulti } from "../services/api";
import "./SearchResults.css";

function SearchResults() {
  const { t } = useTranslation();
  const sentinelRef = useRef(null);
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

  const {
    data: searchPages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["search", queryParam],
    queryFn: ({ pageParam = 1 }) => searchMulti(queryParam, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: Boolean(queryParam),
  });

  const sortedItems = useMemo(() => {
    const rawItems =
      searchPages?.pages
        .flatMap((page) => page.results)
        .filter((item) => item.media_type === "movie" || item.media_type === "tv") ?? [];
    if (!rawItems.length) return [];
    return [...rawItems].sort((a, b) => {
      if (a.media_type === "tv" && b.media_type !== "tv") return -1;
      if (a.media_type !== "tv" && b.media_type === "tv") return 1;
      if (a.popularity !== b.popularity) {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      return (b.vote_average || 0) - (a.vote_average || 0);
    });
  }, [searchPages]);

  const title = useMemo(() => {
    if (!queryParam) return t("search_title_default");
    return t("search_result_title", { query: queryParam });
  }, [queryParam, t]);

  useEffect(() => {
    if (!sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <PageTransition>
      <section className="search-page">
        <Helmet>
          <title>
            CineScope - {queryParam ? t("search_result_title", { query: queryParam }) : t("search_short_title")}
          </title>
          <meta
            name="description"
            content={t("search_subtitle")}
          />
        </Helmet>

        <header className="search-header">
          <h1 className="section-title">{title}</h1>
          <p className="section-subtitle">
            {t("search_subtitle")}
          </p>
        </header>

        <div className="search-input-wrap">
          <input
            type="search"
            value={inputQuery}
            placeholder={t("nav_search_placeholder")}
            onChange={(event) => setInputQuery(event.target.value)}
          />
        </div>

        {!queryParam ? (
          <div className="empty-state">{t("search_empty_prompt")}</div>
        ) : null}

        {isError ? <div className="error-state">{t("search_error")}</div> : null}

        {isLoading && !sortedItems.length ? <SkeletonGrid count={10} /> : null}

        {!!sortedItems.length && (
          <div className="card-grid">
            {sortedItems.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!isLoading && queryParam && !sortedItems.length && !isError ? (
          <div className="empty-state">{t("search_empty_results")}</div>
        ) : null}

        {isFetchingNextPage && sortedItems.length > 0 ? <SkeletonGrid count={4} /> : null}

        <div ref={sentinelRef} className="infinite-sentinel" />
        {!hasNextPage && sortedItems.length > 0 ? <p className="feed-end">{t("feed_end")}</p> : null}
      </section>
    </PageTransition>
  );
}

export default SearchResults;
