import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCompare } from "../context/CompareContext";
import { useWatchlist } from "../context/WatchlistContext";
import { IMG_URL } from "../services/api";
import RatingCounter from "./RatingCounter";
import "./MovieCard.css";

const fallbackPoster = "https://via.placeholder.com/400x600?text=No+Poster";

function MovieCard({ movie, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { add, remove, isCompared, count, maxItems } = useCompare();
  const MotionArticle = motion.article;

  const mediaType = movie.media_type === "tv" || movie.first_air_date ? "tv" : "movie";
  const title = movie.title ?? movie.name ?? "Untitled";
  const year = (movie.release_date ?? movie.first_air_date)?.slice(0, 4) || t("tba");
  const saved = isInWatchlist(movie);
  const compared = isCompared(movie);
  const compareDisabled = !compared && count >= maxItems;

  return (
    <MotionArticle
      className={`movie-card ${compact ? "compact" : ""}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.22 }}
      onClick={() => navigate(`/${mediaType}/${movie.id}`)}
    >
      <div className="movie-poster-wrap">
        <img
          loading="lazy"
          src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : fallbackPoster}
          alt={title}
          className="movie-poster"
        />
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
          }}
          aria-label={saved ? t("btn_remove_watchlist") : t("btn_add_watchlist")}
          title={saved ? t("btn_remove_watchlist") : t("btn_add_watchlist")}
        >
          {saved ? t("btn_saved") : t("btn_save")}
        </button>
        <button
          className={`save-btn compare-btn ${compared ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (compared) {
              remove(movie);
              return;
            }
            add(movie);
          }}
          disabled={compareDisabled}
          aria-label={compared ? t("btn_compared") : t("btn_compare")}
          title={compared ? t("btn_compared") : t("btn_compare")}
        >
          {compared ? t("btn_compared") : t("btn_compare")}
        </button>
      </div>

      <div className="movie-info">
        <h3 title={title}>{title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{year}</span>
          <span className="movie-rating">
            <span className="rating-source">TMDB</span>
            <RatingCounter value={movie.vote_average ?? 0} />
          </span>
        </div>
      </div>
    </MotionArticle>
  );
}

export default MovieCard;
