import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import "./SearchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchMovies(query).then((data) => {
        setMovies(data);
        setLoading(false);
      });
    }
  }, [query]);

  if (loading) return <div className="loading">🔍 Searching...</div>;

  return (
    <div className="search-page">
      <h2 className="search-title">
        Results for: <span>"{query}"</span>
      </h2>
      {movies.length === 0 ? (
        <p className="no-results">No movies found 😕</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;