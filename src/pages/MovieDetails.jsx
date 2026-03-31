import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CastCarousel from "../components/CastCarousel";
import MovieRow from "../components/MovieRow";
import PageTransition from "../components/PageTransition";
import RatingCounter from "../components/RatingCounter";
import TrailerModal from "../components/TrailerModal";
import useFetch from "../hooks/useFetch";
import { useWatchlist } from "../context/WatchlistContext";
import { BACKDROP_URL, IMG_URL, getMovieDetails } from "../services/api";
import "./MovieDetails.css";

const fallbackPoster = "https://via.placeholder.com/400x600?text=No+Poster";

function MovieDetails() {
  const { id } = useParams();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const [openTrailer, setOpenTrailer] = useState(false);
  const fetchMovieDetails = useCallback(() => getMovieDetails(id), [id]);

  const { data: movie, loading, error } = useFetch(fetchMovieDetails, null);

  const trailer = useMemo(
    () =>
      movie?.videos?.results?.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      ),
    [movie]
  );

  const similarMovies = movie?.similar?.results?.slice(0, 14) ?? [];
  const saved = movie ? isInWatchlist(movie.id) : false;

  if (loading) {
    return (
      <PageTransition>
        <div className="details-loading">
          <div className="skeleton details-loading__hero" />
          <div className="skeleton details-loading__content" />
        </div>
      </PageTransition>
    );
  }

  if (error || !movie) {
    return (
      <PageTransition>
        <div className="error-state">Could not load movie details right now.</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <article className="details-page">
        <header
          className="details-hero"
          style={{
            backgroundImage: `url(${BACKDROP_URL}${movie.backdrop_path})`,
          }}
        >
          <div className="details-overlay" />
        </header>

        <div className="details-content">
          <img
            className="details-poster"
            src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : fallbackPoster}
            alt={movie.title}
            loading="lazy"
          />

          <div className="details-info">
            <h1>{movie.title}</h1>

            <div className="details-meta">
              <span>
                <strong>Rating:</strong> <RatingCounter value={movie.vote_average ?? 0} />
              </span>
              <span>
                <strong>Year:</strong> {movie.release_date?.slice(0, 4) || "TBA"}
              </span>
              <span>
                <strong>Runtime:</strong> {movie.runtime || "?"} min
              </span>
            </div>

            <div className="genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="overview">{movie.overview}</p>

            <div className="details-actions">
              <button onClick={() => trailer && setOpenTrailer(true)} disabled={!trailer}>
                {trailer ? "Watch Trailer" : "Trailer Unavailable"}
              </button>
              <button className="secondary" onClick={() => toggleWatchlist(movie)}>
                {saved ? "Remove from Watchlist" : "Save to Watchlist"}
              </button>
            </div>

            <section className="details-section">
              <h2 className="section-title">Cast</h2>
              <CastCarousel cast={movie.credits?.cast ?? []} />
            </section>
          </div>
        </div>

        <MovieRow
          title="Similar Movies"
          subtitle="Because you liked this vibe."
          movies={similarMovies}
        />

        <TrailerModal
          open={openTrailer}
          youtubeKey={trailer?.key}
          title={movie.title}
          onClose={() => setOpenTrailer(false)}
        />
      </article>
    </PageTransition>
  );
}

export default MovieDetails;
