import { useEffect, useState, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";
import MovieRow from "../components/MovieRow";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import TrailerModal from "../components/TrailerModal";
import { getMovieDetails, getPopular, getTrending } from "../services/api";
import "./Home.css";

function Home() {
  const { t } = useTranslation();
  const sentinelRef = useRef(null);
  const [trailerState, setTrailerState] = useState({
    open: false,
    key: "",
    title: "",
  });

  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending(1),
  });

  const {
    data: popularPages,
    fetchNextPage,
    hasNextPage,
    isLoading: popularLoading,
    isFetchingNextPage,
    isError: popularError,
  } = useInfiniteQuery({
    queryKey: ["popular"],
    queryFn: ({ pageParam = 1 }) => getPopular(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const popularMovies = popularPages?.pages.flatMap((page) => page.results) ?? [];

  const trendingMovies = trendingData?.results ?? [];
  const heroMovie = trendingMovies[0] || null;

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

  const openTrailer = async (movie) => {
    try {
      const details = await getMovieDetails(movie.id);
      const trailer = details.videos?.results?.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );

      if (!trailer) return;
      setTrailerState({ open: true, key: trailer.key, title: movie.title });
    } catch {
      // Ignore trailer fetch errors quietly.
    }
  };

  return (
    <PageTransition>
      <div className="home-page">
        <Helmet>
          <title>{t("home_title")}</title>
          <meta name="description" content={t("home_meta_description")} />
        </Helmet>

        <HeroBanner movie={heroMovie} onWatchTrailer={openTrailer} />

        {trendingError ? (
          <div className="error-state">{t("home_trending_error")}</div>
        ) : null}

        <MovieRow
          title={t("home_trending_title")}
          subtitle={t("home_trending_subtitle")}
          movies={trendingMovies.slice(0, 12)}
        />

        <section className="popular-section">
          <h2 className="section-title">{t("home_popular_title")}</h2>
          <p className="section-subtitle">{t("home_popular_subtitle")}</p>

          {popularError ? (
            <div className="error-state">{t("home_popular_error")}</div>
          ) : null}

          {!popularMovies.length && (popularLoading || trendingLoading) ? (
            <SkeletonGrid count={10} />
          ) : (
            <div className="card-grid">
              {popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {isFetchingNextPage && popularMovies.length > 0 ? <SkeletonGrid count={4} /> : null}

          <div ref={sentinelRef} className="infinite-sentinel" />
          {!hasNextPage && popularMovies.length > 0 ? (
            <p className="feed-end">{t("feed_end")}</p>
          ) : null}
        </section>

        <TrailerModal
          open={trailerState.open}
          youtubeKey={trailerState.key}
          title={trailerState.title}
          onClose={() => setTrailerState({ open: false, key: "", title: "" })}
        />
      </div>
    </PageTransition>
  );
}

export default Home;
