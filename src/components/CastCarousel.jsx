import { useRef } from "react";
import { IMG_URL } from "../services/api";
import "./CastCarousel.css";

const fallbackActor = "https://via.placeholder.com/180x180?text=Actor";

function CastCarousel({ cast = [] }) {
  const listRef = useRef(null);

  if (!cast.length) {
    return <p className="section-subtitle">No cast information available yet.</p>;
  }

  const scrollByAmount = (direction) => {
    if (!listRef.current) return;
    listRef.current.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  };

  return (
    <div className="cast-carousel-wrap">
      <div className="cast-controls">
        <button onClick={() => scrollByAmount(-1)} aria-label="Scroll cast left">
          Prev
        </button>
        <button onClick={() => scrollByAmount(1)} aria-label="Scroll cast right">
          Next
        </button>
      </div>

      <div className="cast-carousel" ref={listRef}>
        {cast.slice(0, 18).map((actor) => (
          <article key={actor.id} className="cast-card">
            <img
              loading="lazy"
              src={actor.profile_path ? `${IMG_URL}${actor.profile_path}` : fallbackActor}
              alt={actor.name}
            />
            <h4>{actor.name}</h4>
            <p>{actor.character || "Unknown role"}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CastCarousel;
