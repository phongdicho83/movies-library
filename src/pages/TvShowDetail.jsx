import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb, img } from "../utils/tmdb";
import "./MovieDetail.css"; // Tái sử dụng style của trang chi tiết phim
import TvShowCard from "../components/TvShowCard";

export default function TvShowDetail() {
  const { id } = useParams(); // Lấy tham số :id từ URL
  const [show, setShow] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        // Gọi TMDB để lấy chi tiết TV + video, dàn diễn viên, chương trình tương tự
        const data = await tmdb(`tv/${id}`, {
          append_to_response: "videos,credits,similar,aggregate_credits",
        });
        if (!ignore) setShow(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load TV show details");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true; // Ngăn setState nếu component đã unmount
    };
  }, [id]);

  if (loading) return <p>Loading details…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!show) return null;

  // Tìm trailer/teaser trên YouTube để phát trong modal
  const trailer = show?.videos?.results?.find(
    (vid) =>
      vid.site === "YouTube" &&
      (vid.type === "Trailer" || vid.type === "Teaser")
  );

  // Định dạng tiền tệ USD (nếu có số liệu liên quan)
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Danh sách người tạo show
  const creators = show?.created_by?.map(c => c.name).join(", ") || "N/A";

  return (
    <div className="movie-detail-container">
      {show.backdrop_path && (
        <div className="backdrop-wrapper">
          <img
            src={img(show.backdrop_path, "w1280")}
            alt=""
            className="backdrop-img"
          />
          <div className="backdrop-overlay" />
        </div>
      )}
      <div className="movie-detail-content container">
        <div className="movie-detail-poster-wrapper">
          <img
            src={img(show.poster_path, "w500")}
            alt={show.name}
            className="movie-detail-poster"
          />
        </div>
        <div className="movie-detail-info">
          <h1>{show.name}</h1>
          {show.tagline && <p className="tagline">{show.tagline}</p>}
          {trailer && (
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="play-trailer-btn"
            >
              ▶️ Play Trailer
            </button>
          )}
          <div className="meta">
            {show.vote_average > 0 && (
              <span>⭐ {show.vote_average.toFixed(1)} ({show.vote_count?.toLocaleString()} votes)</span>
            )}
            {show.first_air_date && (
              <span>📅 First Aired: {new Date(show.first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
            {show.status && <span>📊 {show.status}</span>}
            {show.number_of_seasons > 0 && (
              <span>📺 {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
            )}
            {show.number_of_episodes > 0 && (
              <span>🎬 {show.number_of_episodes} Episodes</span>
            )}
          </div>
          <div className="genres">
            {show.genres?.map((g) => (
              <span key={g.id} className="genre">
                {g.name}
              </span>
            ))}
          </div>
          <h3>Overview</h3>
          <p>{show.overview}</p>

          {show.created_by?.length > 0 && (
            <div className="director-info">
              <h3>Created By</h3>
              <p>{creators}</p>
            </div>
          )}

          {show.networks?.length > 0 && (
            <div className="production-info">
              <h3>Networks</h3>
              <p>{show.networks.map(n => n.name).join(', ')}</p>
            </div>
          )}

          {show.production_companies?.length > 0 && (
            <div className="production-info">
              <h3>Production Companies</h3>
              <p>{show.production_companies.map(c => c.name).join(', ')}</p>
            </div>
          )}

          {show.original_language && (
            <div className="language-info">
              <h3>Original Language</h3>
              <p>{show.original_language.toUpperCase()}</p>
            </div>
          )}

          {show.episode_run_time?.length > 0 && (
            <div className="language-info">
              <h3>Episode Runtime</h3>
              <p>{show.episode_run_time[0]} minutes</p>
            </div>
          )}
        </div>
      </div>
      {/* Dàn diễn viên chính (Top Billed Cast) */}
      {show.credits?.cast?.length > 0 && (
        <div className="cast-section container">
          <h3>Top Billed Cast</h3>
          <div className="cast-scroller">
            {show.credits.cast
              .filter((person) => person.profile_path)
              .slice(0, 20)
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
      {/* Chương trình tương tự (Similar TV Shows) */}
      {show.similar?.results?.length > 0 && (
        <div className="similar-movies-section container">
          <h3>Similar TV Shows</h3>
          <div className="movies-scroller">
            {show.similar.results.map((similarShow) => (
              <TvShowCard key={similarShow.id} show={similarShow} />
            ))}
          </div>
        </div>
      )}
      {isTrailerOpen && trailer && (
        <div
          className="trailer-modal-overlay"
          onClick={() => setIsTrailerOpen(false)} // Click nền để đóng
        >
          <div
            className="trailer-modal-content"
            onClick={(e) => e.stopPropagation()} // Chặn nổi bọt để không đóng khi click nội dung
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
              title="TV Show Trailer"
              className="trailer-iframe"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
