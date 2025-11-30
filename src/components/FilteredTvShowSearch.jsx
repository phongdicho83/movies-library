import { useState, useEffect } from 'react';
import { tmdb } from '../utils/tmdb';
import MovieCard from './MovieCard';
import TvShowCard from './TvShowCard';
import './FilteredTvShowSearch.css';

export default function FilteredTvShowSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        setLoading(true);
        const data = await tmdb('search/multi', { query: 'love' });
        
        // Filter: media_type is 'movie' AND vote_average >= 3.9
        const filtered = data.results.filter(
          item => item.media_type === 'movie' && item.vote_average >= 6.0
        );
        
        setResults(filtered);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvShows();
  }, []);

  if (loading) {
    return <div className="filtered-tv-loading">Loading...</div>;
  }

  return (
    <div className="filtered-tv-container">
      <h2>Movies (Vote Average ≥ 3.9)</h2>
      <p className="search-info">Search keyword: "love"</p>
      
      {results.length === 0 ? (
        <p>No movies found matching the criteria.</p>
      ) : (
        <div className="item-container">
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
