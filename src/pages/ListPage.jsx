import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import TvShowCard from "../components/TvShowCard";
import PersonCard from "../components/PersonCard";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const current = config[type]?.[category];

  useEffect(() => {
    if (!current) return;

    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await tmdb(current.path);
        if (!ignore) {
          let items = data.results || [];
          // If the type is person, filter out anyone without a profile picture
          if (type === 'person') {
            items = items.filter(person => person.profile_path);
          }
          setItems(items);
        }
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [current]);

  if (!current) return <p className="error">Sorry, this page doesn't exist.</p>;
  if (loading) return <p>Loading…</p>;
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
      <div className="flex">{items.map(renderCard)}</div>
    </section>
  );
}
