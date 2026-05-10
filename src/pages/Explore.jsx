import { useMemo, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import { getByGenreByType, getGenres } from "../services/api";
import "./Explore.css";

function Explore() {
  const { t } = useTranslation();
  const sentinelRef = useRef(null);
  const [type, setType] = useState("movie");
  const [pickedGenreId, setPickedGenreId] = useState(null);

  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ["genres", type],
    queryFn: () => getGenres(type),
  });

  const selectedGenreId = useMemo(() => {
    if (!genresData?.genres?.length) return null;

    const selectedStillExists = genresData.genres.some((genre) => genre.id === pickedGenreId);
    if (selectedStillExists) return pickedGenreId;
    return genresData.genres[0].id;
  }, [genresData, pickedGenreId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["explore", type, selectedGenreId],
    queryFn: ({ pageParam = 1 }) => getByGenreByType(type, selectedGenreId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: Boolean(selectedGenreId),
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
        media_type: type,
      }))
    ) ?? [];

  return (
    <PageTransition>
      <section className="explore-page">
        <Helmet>
          <title>CineScope - {t("explore_title")}</title>
          <meta name="description" content={t("explore_meta_description")} />
        </Helmet>

        <header className="explore-header">
          <h1 className="section-title">{t("explore_title")}</h1>
          <p className="section-subtitle">{t("explore_subtitle")}</p>
        </header>

        <div className="explore-type-tabs">
          <button
            className={type === "movie" ? "active" : ""}
            onClick={() => {
              setType("movie");
              setPickedGenreId(null);
            }}
            type="button"
          >
            {t("random_type_movie")}
          </button>
          <button
            className={type === "tv" ? "active" : ""}
            onClick={() => {
              setType("tv");
              setPickedGenreId(null);
            }}
            type="button"
          >
            {t("random_type_tv")}
          </button>
        </div>

        <div className="genres-filter">
          {genresLoading ? (
            <p className="section-subtitle">{t("explore_loading_genres")}</p>
          ) : (
            genresData?.genres?.map((genre) => (
              <button
                key={genre.id}
                className={selectedGenreId === genre.id ? "active" : ""}
                onClick={() => setPickedGenreId(genre.id)}
                type="button"
              >
                {genre.name}
              </button>
            ))
          )}
        </div>

        {isError ? <div className="error-state">{t("explore_genre_error")}</div> : null}

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
        {!hasNextPage && items.length > 0 ? <p className="feed-end">{t("feed_end")}</p> : null}
      </section>
    </PageTransition>
  );
}

export default Explore;
