import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb, img } from "../utils/tmdb";
import "./PersonDetail.css";
import MovieCard from "../components/MovieCard";
import TvShowCard from "../components/TvShowCard";

export default function PersonDetail() {
  const { id } = useParams(); // Lấy tham số :id từ URL
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        // Gọi TMDB để lấy chi tiết người + danh sách credit gộp (movie/tv) + ảnh
        const data = await tmdb(`person/${id}`, {
          append_to_response: "combined_credits,images",
        });
        if (!ignore) setPerson(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load person details");
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
  if (!person) return null;

  // Sắp xếp credit theo độ nổi tiếng và giới hạn 20 mục "Known For"
  const sortedCredits =
    person.combined_credits?.cast
      ?.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 20) || [];

  // Tính tuổi tại thời điểm hiện tại (hoặc tại ngày mất nếu có)
  const calculateAge = (birthday, deathday) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <div className="person-detail-container">
      <div className="person-detail-content container">
        <div className="person-detail-sidebar">
          <div className="person-detail-poster-wrapper">
            <img
              src={img(person.profile_path, "w500")}
              alt={person.name}
              className="person-detail-poster"
            />
          </div>
          <div className="person-info-sidebar">
            <h3>Personal Info</h3> {/* Thông tin cá nhân bên cạnh */}

            {person.known_for_department && (
              <div className="info-item">
                <strong>Known For</strong>
                <p>{person.known_for_department}</p>
              </div>
            )}

            {person.gender && (
              <div className="info-item">
                <strong>Gender</strong>
                <p>
                  {person.gender === 1
                    ? "Female"
                    : person.gender === 2
                    ? "Male"
                    : "Other"}
                </p>
              </div>
            )}

            {person.birthday && (
              <div className="info-item">
                <strong>Birthday</strong>
                <p>
                  {new Date(person.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {age && ` (${age} years old)`}
                </p>
              </div>
            )}

            {person.deathday && (
              <div className="info-item">
                <strong>Day of Death</strong>
                <p>
                  {new Date(person.deathday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {person.place_of_birth && (
              <div className="info-item">
                <strong>Place of Birth</strong>
                <p>{person.place_of_birth}</p>
              </div>
            )}

            {person.also_known_as?.length > 0 && (
              <div className="info-item">
                <strong>Also Known As</strong>
                {person.also_known_as.map((name, idx) => (
                  <p key={idx}>{name}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="person-detail-main">
          <h1>{person.name}</h1>

          {person.biography && (
            <div className="biography-section">
              <h2>Biography</h2>
              <p className="biography-text">{person.biography}</p>
            </div>
          )}

          {sortedCredits.length > 0 && (
            <div className="known-for-section">
              <h2>Known For</h2> {/* Các tác phẩm tiêu biểu, ưu tiên theo popularity */}
              <div className="known-for-scroller">
                {sortedCredits.map((credit) => {
                  if (credit.media_type === "movie") {
                    return (
                      <MovieCard
                        key={`${credit.id}-${credit.credit_id}`}
                        movie={credit}
                      />
                    );
                  } else if (credit.media_type === "tv") {
                    return (
                      <TvShowCard
                        key={`${credit.id}-${credit.credit_id}`}
                        show={credit}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
