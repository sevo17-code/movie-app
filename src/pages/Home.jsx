import { useEffect, useState } from "react";
import { getTrending } from "../services/api";
import MovieCard from "../components/MovieCard";
import "./Home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">🎬 Loading...</div>;

  const hero = movies[0];

  return (
    <div className="home">
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${hero.backdrop_path})`,
        }}
      >
        <div className="hero-overlay">
          <h2>{hero.title}</h2>
          <p>{hero.overview}</p>
          <span className="hero-rating">⭐ {hero.vote_average?.toFixed(1)}</span>
        </div>
      </div>

      {/* Trending Section */}
      <div className="section">
        <h2 className="section-title">🔥 Trending This Week</h2>
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;