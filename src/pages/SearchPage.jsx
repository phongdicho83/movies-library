import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import TvShowCard from "../components/TvShowCard";
import PersonCard from "../components/PersonCard";
import LoadMore from "../components/LoadMore";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset trạng thái khi search thay đổi
  useEffect(() => {
    setItems([]);
    setPage(1);
    setError(null);
  }, [query]);

  // Lấy kết quả tìm kiếm
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    let ignore = false;
    async function load() {
      if (page === 1) setLoading(true);
      try {
        const data = await tmdb("search/multi", { query, page });
        if (!ignore) {
          const validItems = (data.results || []).filter(
            (item) =>
              item.media_type === "movie" ||
              item.media_type === "tv" ||
              (item.media_type === "person" && item.profile_path)
          );
          setItems((prevItems) => [...prevItems, ...validItems]);
        }
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load search results");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [query, page]);

  const renderCard = (item) => {
    switch (item.media_type) {
      case "movie":
        return <MovieCard key={`movie-${item.id}`} movie={item} />;
      case "tv":
        return <TvShowCard key={`tv-${item.id}`} show={item} />;
      case "person":
        return <PersonCard key={`person-${item.id}`} person={item} />;
      default:
        return null;
    }
  };

  if (page === 1 && loading) return <p>Searching...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h1>Search Results for "{query}"</h1>
      <div className="item-container">
        {items.length > 0
          ? items.map(renderCard)
          : !loading && <p>No results found.</p>}
      </div>
      <LoadMore
        show={items.length > 0}
        onLoadMore={() => setPage((p) => p + 1)}
      />
    </section>
  );
}
