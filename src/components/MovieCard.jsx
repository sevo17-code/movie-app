import { useNavigate } from "react-router-dom";
import { IMG_URL } from "../services/api";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img
        src={
          movie.poster_path
            ? `${IMG_URL}${movie.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Image"
        }
        alt={movie.title}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default MovieCard;