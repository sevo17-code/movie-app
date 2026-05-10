import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import { getTopRatedMovies, getTopRatedTV } from "../services/api";
import "./TopRated.css";

function TopRated({ type = "movie" }) {
  const { t } = useTranslation();
  const sentinelRef = useRef(null);
  const isTV = type === "tv";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["top-rated", type],
    queryFn: ({ pageParam = 1 }) =>
      isTV ? getTopRatedTV(pageParam) : getTopRatedMovies(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const items = useMemo(() => {
    const raw = data?.pages.flatMap((page) => page.results) ?? [];
    return raw.map((item) => ({
      ...item,
      media_type: isTV ? "tv" : "movie",
    }));
  }, [data, isTV]);

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
      <section className="top-rated-page">
        <Helmet>
          <title>{`CineScope - ${isTV ? t("top_series_title") : t("top_movies_title")}`}</title>
          <meta
            name="description"
            content={isTV ? t("top_series_meta") : t("top_movies_meta")}
          />
        </Helmet>

        <header className="top-rated-header">
          <h1 className="section-title">{isTV ? t("top_series_title") : t("top_movies_title")}</h1>
          <p className="section-subtitle">{t("top_subtitle")}</p>
        </header>

        {isError ? (
          <div className="error-state">{t("top_error")}</div>
        ) : null}

        {isLoading && !items.length ? <SkeletonGrid count={10} /> : null}

        {!!items.length && (
          <div className="card-grid">
            {items.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
            ))}
          </div>
        )}

        {isFetchingNextPage && items.length > 0 ? <SkeletonGrid count={4} /> : null}

        <div ref={sentinelRef} className="infinite-sentinel" />
        {!hasNextPage && items.length > 0 ? (
          <p className="feed-end">{t("feed_end")}</p>
        ) : null}
      </section>
    </PageTransition>
  );
}

export default TopRated;
