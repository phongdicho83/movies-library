import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { tmdb, img } from '../utils/tmdb'
import './MovieDetail.css'

export default function MovieDetail() {
  const { id } = useParams() // grab the :id from URL
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const data = await tmdb(`movie/${id}`)
        if (!ignore) setMovie(data)
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load movie details')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [id])

  if (loading) return <p>Loading details…</p>
  if (error) return <p className="error">{error}</p>
  if (!movie) return null

  const formatRuntime = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  return (
    <div className="movie-detail-container">
      {movie.backdrop_path && (
        <div className="backdrop-wrapper">
          <img
            src={img(movie.backdrop_path, 'w1280')}
            alt=""
            className="backdrop-img"
          />
          <div className="backdrop-overlay" />
        </div>
      )}
      <div className="movie-detail-content container">
        <div className="movie-detail-poster-wrapper">
          <img
            src={img(movie.poster_path, 'w500')}
            alt={movie.title}
            className="movie-detail-poster"
          />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          <div className="meta">
            {movie.vote_average > 0 && (
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            )}
            {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
            {movie.release_date && (
              <span>{movie.release_date.split('-')[0]}</span>
            )}
          </div>
          <div className="genres">
            {movie.genres?.map(g => (
              <span key={g.id} className="genre">
                {g.name}
              </span>
            ))}
          </div>
          <h3>Overview</h3>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  )
}
