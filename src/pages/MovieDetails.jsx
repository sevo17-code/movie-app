import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, IMG_URL } from "../services/api";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovieDetails(id).then((data) => {
      setMovie(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="loading">🎬 Loading...</div>;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="details-page">
      <div
        className="details-hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="details-overlay" />
      </div>

      <div className="details-content">
        <img
          className="details-poster"
          src={`${IMG_URL}${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="details-info">
          <h1>{movie.title}</h1>
          <div className="details-meta">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>📅 {movie.release_date?.slice(0, 4)}</span>
            <span>⏱ {movie.runtime} min</span>
          </div>
          <div className="genres">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre-tag">{g.name}</span>
            ))}
          </div>
          <p className="overview">{movie.overview}</p>

          {/* Trailer */}
          {trailer && (
            <div className="trailer">
              <h3>🎥 Trailer</h3>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allowFullScreen
                title="trailer"
              />
            </div>
          )}

          {/* Cast */}
          <div className="cast">
            <h3>🎭 Cast</h3>
            <div className="cast-list">
              {movie.credits?.cast?.slice(0, 6).map((actor) => (
                <div key={actor.id} className="actor">
                  <img
                    src={
                      actor.profile_path
                        ? `${IMG_URL}${actor.profile_path}`
                        : "https://via.placeholder.com/100x100?text=N/A"
                    }
                    alt={actor.name}
                  />
                  <p>{actor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
