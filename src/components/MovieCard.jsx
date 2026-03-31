import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { IMG_URL } from "../services/api";
import RatingCounter from "./RatingCounter";
import "./MovieCard.css";

const fallbackPoster = "https://via.placeholder.com/400x600?text=No+Poster";

function MovieCard({ movie, compact = false }) {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const MotionArticle = motion.article;

  const saved = isInWatchlist(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "TBA";

  return (
    <MotionArticle
      className={`movie-card ${compact ? "compact" : ""}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.22 }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-poster-wrap">
        <img
          loading="lazy"
          src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : fallbackPoster}
          alt={movie.title}
          className="movie-poster"
        />
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
          }}
          aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          title={saved ? "Remove from watchlist" : "Add to watchlist"}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="movie-info">
        <h3 title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{year}</span>
          <span className="movie-rating">
            <span aria-hidden>IMDB</span> <RatingCounter value={movie.vote_average ?? 0} />
          </span>
        </div>
      </div>
    </MotionArticle>
  );
}

export default MovieCard;
