import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import { useTranslation } from "react-i18next";
import { useWatchlist } from "../context/WatchlistContext";
import "./Watchlist.css";

function Watchlist() {
  const { t } = useTranslation();
  const { watchlist, clearWatchlist } = useWatchlist();

  return (
    <PageTransition>
      <section className="watchlist-page">
        <header className="watchlist-head">
          <div>
            <h1 className="section-title">{t("watchlist_title")}</h1>
            <p className="section-subtitle">
              {t("watchlist_subtitle")}
            </p>
          </div>

          {watchlist.length > 0 ? (
            <button onClick={clearWatchlist} className="clear-watchlist">
              {t("btn_clear")}
            </button>
          ) : null}
        </header>

        {watchlist.length === 0 ? (
          <div className="empty-state">
            {t("watchlist_empty")}
          </div>
        ) : (
          <div className="card-grid">
            {watchlist.map((movie) => (
              <MovieCard key={`${movie.media_type ?? "movie"}-${movie.id}`} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export default Watchlist;
