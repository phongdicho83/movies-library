import { useEffect, useState } from 'react'
import { tmdb } from '../utils/tmdb'
import MovieCard from '../components/MovieCard'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const data = await tmdb('movie/popular')
        if (!ignore) setMovies(data.results || [])
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  if (loading) return <p>Loading popular movies…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <section>
      <h1>Popular Movies</h1>
      <div className="grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
