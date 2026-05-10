import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BACKDROP_URL } from "../services/api";
import RatingCounter from "./RatingCounter";
import "./HeroBanner.css";

function HeroBanner({ movie, onWatchTrailer }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const MotionDiv = motion.div;

  if (!movie) {
    return <div className="hero-banner skeleton" />;
  }

  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `url(${BACKDROP_URL}${movie.backdrop_path})`,
      }}
    >
      <div className="hero-banner__veil" />

      <MotionDiv
        className="hero-banner__content"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="hero-banner__eyebrow">{t("hero_eyebrow")}</p>
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>

        <div className="hero-banner__meta">
          <span className="chip">
            {t("rating")} <RatingCounter value={movie.vote_average ?? 0} />
          </span>
          <span className="chip">{movie.release_date?.slice(0, 4) || t("upcoming")}</span>
        </div>

        <div className="hero-banner__actions">
          <button onClick={() => navigate(`/movie/${movie.id}`)}>{t("hero_explore_movie")}</button>
          <button
            className="secondary"
            onClick={() => onWatchTrailer(movie)}
            disabled={!onWatchTrailer}
          >
            {t("hero_play_trailer")}
          </button>
        </div>
      </MotionDiv>
    </section>
  );
}

export default HeroBanner;
