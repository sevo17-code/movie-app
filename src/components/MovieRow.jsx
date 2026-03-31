import { useRef } from "react";
import MovieCard from "./MovieCard";
import "./MovieRow.css";

function MovieRow({ title, subtitle, movies = [] }) {
  const rowRef = useRef(null);

  if (!movies.length) return null;

  const shift = (direction) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: direction * 820, behavior: "smooth" });
  };

  return (
    <section className="movie-row">
      <header className="movie-row__head">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>

        <div className="movie-row__controls">
          <button onClick={() => shift(-1)} aria-label={`Scroll ${title} left`}>
            Prev
          </button>
          <button onClick={() => shift(1)} aria-label={`Scroll ${title} right`}>
            Next
          </button>
        </div>
      </header>

      <div className="movie-row__list" ref={rowRef}>
        {movies.map((movie) => (
          <div className="movie-row__item" key={movie.id}>
            <MovieCard movie={movie} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieRow;
