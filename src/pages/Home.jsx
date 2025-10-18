import { useEffect, useState } from "react";
import { tmdb } from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import LoadMore from "../components/LoadMore";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      // Chỉ hiển thị loading cho lần tải đầu tiên
      if (page === 1) setLoading(true);
      try {
        const data = await tmdb("movie/now_playing", { page });
        if (!ignore) {
          setMovies((prevMovies) => [...prevMovies, ...(data.results || [])]);
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
  }, [page]);

  function handleLoadMore() {
    setPage((prevPage) => prevPage + 1);
  }

  if (page === 1 && loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h1>Popular Movies</h1>
      <div className="flex">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          !loading && <p>No movies found.</p>
        )}
      </div>
      <LoadMore show={movies.length > 0} onLoadMore={handleLoadMore} />
    </section>
  );
}
