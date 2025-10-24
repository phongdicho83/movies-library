import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb, img } from "../utils/tmdb";
import "./MovieDetail.css";
// Các component hiển thị thẻ phim liên quan
import MovieCard from "../components/MovieCard";

export default function MovieDetail() {
  const { id } = useParams(); // Lấy tham số :id từ URL
  const [movie, setMovie] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        // Gọi TMDB để lấy chi tiết phim + video, dàn diễn viên, phim tương tự
        const data = await tmdb(`movie/${id}`, {
          append_to_response: "videos,credits,similar",
        });
        if (!ignore) setMovie(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load movie details"); // Thông báo lỗi
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true; // Ngăn setState sau khi unmount / deps đổi
    };
  }, [id]);

  if (loading) return <p>Loading details…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return null;

  // Tìm trailer/teaser trên YouTube để phát trong modal
  const trailer = movie?.videos?.results?.find(
    (vid) =>
      vid.site === "YouTube" &&
      (vid.type === "Trailer" || vid.type === "Teaser")
  );

  // Định dạng thời lượng phim sang giờ/phút
  const formatRuntime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Định dạng tiền tệ USD (ngân sách/doanh thu)
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Tìm đạo diễn trong danh sách crew
  const director = movie?.credits?.crew?.find(
    (person) => person.job === "Director"
  );

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
              <span>
                ⭐ {movie.vote_average.toFixed(1)} (
                {movie.vote_count?.toLocaleString()} votes)
              </span>
            )}
            {movie.runtime > 0 && (
              <span>⏱️ {formatRuntime(movie.runtime)}</span>
            )}
            {movie.release_date && (
              <span>
                📅{" "}
                {new Date(movie.release_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {movie.status && <span>📊 {movie.status}</span>}
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

          {director && (
            <div className="director-info">
              <h3>Director</h3>
              <p>{director.name}</p>
            </div>
          )}

          {(movie.budget > 0 || movie.revenue > 0) && (
            <div className="financial-info">
              <h3>Box Office</h3>
              <div className="financial-grid">
                {movie.budget > 0 && (
                  <div>
                    <strong>Budget:</strong> {formatCurrency(movie.budget)}
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <strong>Revenue:</strong> {formatCurrency(movie.revenue)}
                  </div>
                )}
              </div>
            </div>
          )}

          {movie.production_companies?.length > 0 && (
            <div className="production-info">
              <h3>Production Companies</h3>
              <p>{movie.production_companies.map((c) => c.name).join(", ")}</p>
            </div>
          )}

          {movie.original_language && (
            <div className="language-info">
              <h3>Original Language</h3>
              <p>{movie.original_language.toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>
      {/* Phim tương tự (Similar Movies) */}
      {movie.similar?.results?.length > 0 && (
        <div className="similar-movies-section container">
          <h3>Similar Movies</h3>
          <div className="movies-scroller">
            {movie.similar.results.map((similarMovie) => (
              <MovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </div>
      )}
      {/* Dàn diễn viên chính (Top Billed Cast) */}
      {movie.credits?.cast?.length > 0 && (
        <div className="cast-section container">
          <h3>Top Billed Cast</h3>
          <div className="cast-scroller">
            {movie.credits.cast
              .filter((person) => person.profile_path)
              .map((person) => (
                <Link
                  to={`/person/${person.id}`}
                  key={person.id}
                  className="cast-member-link"
                >
                  <div className="cast-member">
                    <img
                      src={img(person.profile_path, "w185")}
                      alt={person.name}
                    />
                    <div className="cast-member-info">
                      <strong>{person.name}</strong>
                      <span>{person.character}</span>
                    </div>
                  </div>
                </Link>
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
