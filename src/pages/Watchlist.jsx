import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import { useWatchlist } from "../context/WatchlistContext";
import "./Watchlist.css";

function Watchlist() {
  const { watchlist, clearWatchlist } = useWatchlist();

  return (
    <PageTransition>
      <section className="watchlist-page">
        <header className="watchlist-head">
          <div>
            <h1 className="section-title">Your Watchlist</h1>
            <p className="section-subtitle">
              Saved movies stay here with localStorage persistence.
            </p>
          </div>

          {watchlist.length > 0 ? (
            <button onClick={clearWatchlist} className="clear-watchlist">
              Clear All
            </button>
          ) : null}
        </header>

        {watchlist.length === 0 ? (
          <div className="empty-state">
            Your watchlist is empty. Save movies from any card to see them here.
          </div>
        ) : (
          <div className="card-grid">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export default Watchlist;
