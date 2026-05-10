import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import { getDiscoverByRegion } from "../services/api";
import "./WorldCinema.css";

const REGIONS = [
  "US",
  "EG",
  "SA",
  "AE",
  "KW",
  "QA",
  "JO",
  "LB",
  "MA",
  "DZ",
  "TN",
  "FR",
  "IN",
  "JP",
  "KR",
  "BR",
  "TR",
  "IT",
  "ES",
  "DE",
  "GB",
];

function WorldCinema() {
  const { t } = useTranslation();
  const [region, setRegion] = useState("US");
  const sentinelRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: ["world-cinema", region],
      queryFn: ({ pageParam = 1 }) => getDiscoverByRegion(region, pageParam),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
    });

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

  const items =
    data?.pages.flatMap((page) =>
      page.results.map((item) => ({
        ...item,
        media_type: "movie",
      })).filter((item) => !item.adult && (item.vote_average ?? 0) > 0)
    ) ?? [];

  return (
    <PageTransition>
      <section className="world-page">
        <Helmet>
          <title>CineScope - {t("world_title")}</title>
          <meta name="description" content={t("world_subtitle")} />
        </Helmet>
        <header className="world-header">
          <h1 className="section-title">{t("world_title")}</h1>
          <p className="section-subtitle">{t("world_subtitle")}</p>
        </header>

        <div className="world-regions">
          {REGIONS.map((code) => (
            <button
              key={code}
              type="button"
              className={region === code ? "active" : ""}
              onClick={() => setRegion(code)}
            >
              {code}
            </button>
          ))}
        </div>

        {isError ? <div className="error-state">{t("load_error")}</div> : null}
        {isLoading && !items.length ? <SkeletonGrid count={10} /> : null}
        {!!items.length && (
          <div className="card-grid">
            {items.map((item) => (
              <MovieCard key={`world-${item.id}`} movie={item} />
            ))}
          </div>
        )}
        {isFetchingNextPage && items.length > 0 ? <SkeletonGrid count={4} /> : null}

        <div ref={sentinelRef} className="infinite-sentinel" />
        {!hasNextPage && items.length > 0 ? <p className="feed-end">{t("feed_end")}</p> : null}
      </section>
    </PageTransition>
  );
}

export default WorldCinema;
