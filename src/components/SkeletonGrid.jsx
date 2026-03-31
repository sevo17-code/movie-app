function SkeletonGrid({ count = 8 }) {
  return (
    <div className="card-grid" aria-hidden>
      {Array.from({ length: count }).map((_, idx) => (
        <article key={idx} className="movie-card">
          <div className="skeleton movie-poster" />
          <div className="movie-info">
            <div className="skeleton" style={{ height: 15, borderRadius: 8 }} />
            <div
              className="skeleton"
              style={{ height: 12, width: "55%", borderRadius: 8, marginTop: 8 }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

export default SkeletonGrid;
