import { useCallback, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";
import MovieRow from "../components/MovieRow";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import TrailerModal from "../components/TrailerModal";
import useFetch from "../hooks/useFetch";
import useInfiniteMovies from "../hooks/useInfiniteMovies";
import { getMovieDetails, getPopular, getTrending } from "../services/api";
import "./Home.css";

function Home() {
  const [trailerState, setTrailerState] = useState({
    open: false,
    key: "",
    title: "",
  });

  const fetchTrending = useCallback(() => getTrending(1), []);

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(fetchTrending);

  const fetchPopularPage = useCallback((page) => getPopular(page), []);

  const {
    items: popularMovies,
    loading: popularLoading,
    error: popularError,
    hasMore,
    sentinelRef,
  } = useInfiniteMovies(fetchPopularPage);

  const trendingMovies = trendingData?.results ?? [];
  const heroMovie = trendingMovies[0] || null;

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
        <HeroBanner movie={heroMovie} onWatchTrailer={openTrailer} />

        {trendingError ? (
          <div className="error-state">Could not load trending movies.</div>
        ) : null}

        <MovieRow
          title="Trending This Week"
          subtitle="Fresh picks everyone is watching right now."
          movies={trendingMovies.slice(0, 12)}
        />

        <section className="popular-section">
          <h2 className="section-title">Popular Discoveries</h2>
          <p className="section-subtitle">
            Infinite feed curated from TMDB popular listings.
          </p>

          {popularError ? (
            <div className="error-state">Could not load popular feed right now.</div>
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

          {popularLoading && popularMovies.length > 0 ? <SkeletonGrid count={4} /> : null}

          <div ref={sentinelRef} className="infinite-sentinel" />
          {!hasMore && popularMovies.length > 0 ? (
            <p className="feed-end">You reached the end of the popular feed.</p>
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
