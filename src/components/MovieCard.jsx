import { Link } from "react-router-dom";
import { img } from "../utils/tmdb";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="card">
      {movie.poster_path ? ( // If poster_path is available, show it, else show placeholder
        <img
          src={img(movie.poster_path, "w342")}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="placeholder" />
      )}
      <div className="card-body">
        <h3>{movie.title}</h3>
        <div className="card-footer">
          {movie.vote_average > 0 && (
            <span className="muted">⭐ {movie.vote_average.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
