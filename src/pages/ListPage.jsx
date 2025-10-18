import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import TvShowCard from "../components/TvShowCard";
import PersonCard from "../components/PersonCard";
import LoadMore from "../components/LoadMore";

// A map to translate URL parts to API paths and titles
const config = {
  movies: {
    popular: { path: "movie/popular", title: "Popular Movies" },
    upcoming: { path: "movie/upcoming", title: "Upcoming Movies" },
    "top-rated": { path: "movie/top_rated", title: "Top Rated Movies" },
  },
  tvshows: {
    popular: { path: "tv/popular", title: "Popular TV Shows" },
    "on-tv": { path: "tv/on_the_air", title: "Currently Airing TV Shows" },
    "top-rated": { path: "tv/top_rated", title: "Top Rated TV Shows" },
  },
  person: {
    popular: { path: "person/popular", title: "Popular People" },
  },
};

export default function ListPage() {
  const { type, category } = useParams();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const current = config[type]?.[category];

  useEffect(() => {
    if (!current) return;
    setItems([]);
    setPage(1);
    setError(null);
  }, [current]);

  useEffect(() => {
    if (!current) return;

    let ignore = false;
    async function load() {
      // Chỉ hiển thị loading cho lần tải đầu tiên của một danh mục
      if (page === 1) setLoading(true);
      try {
        const data = await tmdb(current.path, { page });
        if (!ignore) {
          let newItems = data.results || [];
          // If the type is person, filter out anyone without a profile picture
          if (type === "person") {
            newItems = newItems.filter((person) => person.profile_path);
          }
          setItems((prevItems) => [...prevItems, ...newItems]);
        }
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load");
      } finally {
        if (!ignore && page === 1) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [current, page]);

  function handleLoadMore() {
    setPage((prevPage) => prevPage + 1);
  }

  if (!current) return <p className="error">Sorry, this page doesn't exist.</p>;
  // Hiển thị loading chỉ khi đang tải trang đầu tiên
  if (page === 1 && loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  const renderCard = (item) => {
    switch (type) {
      case "movies":
        return <MovieCard key={item.id} movie={item} />;
      case "tvshows":
        return <TvShowCard key={item.id} show={item} />;
      case "person":
        return <PersonCard key={item.id} person={item} />;
      default:
        return null;
    }
  };

  return (
    <section>
      <h1>{current.title}</h1>
      <div className="flex">
        {items.length > 0 ? (
          items.map(renderCard)
        ) : (
          !loading && <p>No items found.</p>
        )}
      </div>
      <LoadMore show={items.length > 0} onLoadMore={handleLoadMore} />
    </section>
  );
}
