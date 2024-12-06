import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const navigate = useNavigate();
  let { movieId } = useParams();

  // Function to search for movies
  const searchMovies = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: 'f10ad5116962b95dec6775837d225574',
          query: query,
        },
      });
      setSearchedMovieList(response.data.results);
    } catch (error) {
      console.error("Error fetching movie list:", error);
    }
  };

  // Function to fetch movie details
  const fetchMovieDetails = useCallback(async (movieId) => {
    if (!movieId) return;

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { api_key: 'f10ad5116962b95dec6775837d225574' },
      });
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, []);

  // Fetch movie details whenever movieId changes
  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId, fetchMovieDetails]);

  // Handle movie click to navigate to movie details page
  const handleMovieClick = (id) => {
    navigate(`/main/movies/${id}`);
  };

  return (
    <div className="form-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="search-input"
        />
        <button onClick={() => searchMovies(query)} className="search-button">
          Search
        </button>
      </div>

      <div className="movie-list">
        {searchedMovieList.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>

      <Outlet /> {/* Used to render nested routes */}
    </div>
  );
};

export default Form;
