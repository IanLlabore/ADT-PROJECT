import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import './MovieDetails.css'; // Optional styling

// Slick Carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const MovieDetails = () => {
  const { movieId } = useParams();  // Extract movieId from URL
  const [movieDetails, setMovieDetails] = useState({
    movie: undefined,
    cast: [],
    crew: [],
    videos: [],
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie details, cast, crew, and images on component mount or movieId change
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Fetching the movie details
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574', // Replace with your API key
          },
        });
        
        // Fetching the cast and crew details
        const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574', // Replace with your API key
          },
        });

        // Fetching movie still images
        const imagesResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574', // Replace with your API key
          },
        });

        setMovieDetails({
          movie: movieResponse.data,
          cast: castResponse.data.cast,
          crew: castResponse.data.crew,
          images: imagesResponse.data.backdrops,
        });
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch movie details.");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="movie-details">
      {/* Movie Info */}
      <h1>{movieDetails.movie?.title}</h1>
      <p>{movieDetails.movie?.overview}</p>
      <img 
        src={`https://image.tmdb.org/t/p/w500${movieDetails.movie?.poster_path}`} 
        alt={movieDetails.movie?.title}
      />

      {/* Carousel for Movie Stills */}
      <h2>Movie Stills</h2>
      <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
        {movieDetails.images.map((image) => (
          <div key={image.file_path}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${image.file_path}`} 
              alt="Movie Still"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </Slider>

      {/* Cast Section */}
      <h2>Cast</h2>
      <div className="cast">
        {movieDetails.cast.map((actor) => (
          <div key={actor.id}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} 
              alt={actor.name} 
              style={{ width: '150px', height: 'auto', borderRadius: '50%' }}
            />
            <p>{actor.name}</p>
          </div>
        ))}
      </div>

      {/* Crew Section */}
      <h2>Crew</h2>
      <div className="crew">
        {movieDetails.crew.map((crewMember) => (
          <div key={crewMember.id}>
            <p>{crewMember.name} - {crewMember.job}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
