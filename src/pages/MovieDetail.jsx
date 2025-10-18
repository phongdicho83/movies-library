import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb, img } from "../utils/tmdb";
import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams(); // grab the :id from URL
  const [movie, setMovie] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await tmdb(`movie/${id}`, {
          append_to_response: "videos,credits",
        });
        if (!ignore) setMovie(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load movie details");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <p>Loading details…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return null;

  const trailer = movie?.videos?.results?.find(
    (vid) =>
      vid.site === "YouTube" &&
      (vid.type === "Trailer" || vid.type === "Teaser")
  );

  const formatRuntime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="movie-detail-container">
      {movie.backdrop_path && (
        <div className="backdrop-wrapper">
          <img
            src={img(movie.backdrop_path, "w1280")}
            alt=""
            className="backdrop-img"
          />
          <div className="backdrop-overlay" />
        </div>
      )}
      <div className="movie-detail-content container">
        <div className="movie-detail-poster-wrapper">
          <img
            src={img(movie.poster_path, "w500")}
            alt={movie.title}
            className="movie-detail-poster"
          />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          {trailer && (
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="play-trailer-btn"
            >
              ▶️ Play Trailer
            </button>
          )}
          <div className="meta">
            {movie.vote_average > 0 && (
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            )}
            {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
            {movie.release_date && (
              <span>{movie.release_date.split("-")[0]}</span>
            )}
          </div>
          <div className="genres">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre">
                {g.name}
              </span>
            ))}
          </div>
          <h3>Overview</h3>
          <p>{movie.overview}</p>
        </div>
      </div>

      {movie.credits?.cast?.length > 0 && (
        <div className="cast-section container">
          <h3>Top Billed Cast</h3>
          <div className="cast-scroller">
            {movie.credits.cast
              .filter((person) => person.profile_path)
              .map((person) => (
                <div key={person.id} className="cast-member">
                  <img
                    src={img(person.profile_path, "w185")}
                    alt={person.name}
                  />
                  <strong>{person.name}</strong>
                  <span>{person.character}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {isTrailerOpen && trailer && (
        <div
          className="trailer-modal-overlay"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className="trailer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setIsTrailerOpen(false)}
            >
              &times;
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Movie Trailer"
              className="trailer-iframe"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
