import { Link } from "react-router-dom";
import { img } from "../utils/tmdb";
import "./MovieCard.css"; // Reusing the same styles for consistency

export default function TvShowCard({ show }) {
  return (
    <Link to={`/tv/${show.id}`} className="card">
      {show.poster_path ? (
        <img
          src={img(show.poster_path, "w342")}
          alt={show.name}
          loading="lazy"
        />
      ) : (
        <div className="placeholder" />
      )}
      <div className="card-body">
        <h3>{show.name}</h3>
        <div className="card-footer">
          {show.vote_average > 0 && (
            <span className="muted">⭐ {show.vote_average.toFixed(1)}</span>
          )}
          {show.first_air_date && (
            <span className="muted">{show.first_air_date}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
