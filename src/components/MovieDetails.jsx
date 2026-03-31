function MovieDetails({ movie }) {
  if (!movie) return null;

  return (
    <div>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
    </div>
  );
}

export default MovieDetails;
