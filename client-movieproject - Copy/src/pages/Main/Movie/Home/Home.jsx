import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';

const Home = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getMovies = () => {
    axios
      .get('/movies')
      .then((response) => {
        setMovieList(response.data);
        setFilteredMovies(response.data); // Set all movies initially
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter movies based on the search query
    const filtered = movieList.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  useEffect(() => {
    setTimeout(() => {
      if (movieList.length) {
        const random = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[random]);
      }
    }, 5000);
  }, [featuredMovie]);

  return (
    <div className="main-container">
      <h1 className="page-title">Movies</h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
          placeholder="Search for a movie..."
        />
      </div>

      {featuredMovie && movieList.length ? (
        <div className="featured-list-container">
          <div
            className="featured-backdrop"
            style={{
              background: `url(${
                featuredMovie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center center / cover`,
            }}
          >
            <span className="featured-movie-title">{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className="featured-list-container-loader"></div>
      )}

      {/* Movie Cards Grid */}
      <div className="list-container">
        {filteredMovies.map((movie) => (
          <MovieCards
            key={movie.id}
            movie={movie}
            onClick={() => {
              navigate(`/view/${movie.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
