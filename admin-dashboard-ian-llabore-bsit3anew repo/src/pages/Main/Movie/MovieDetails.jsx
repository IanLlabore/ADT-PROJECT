import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css'; // Optional styling

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

  // Fetch movie details on component mount or movieId change
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574',  // Replace with your API key
          }
        });
        setMovieDetails((prevDetails) => ({
          ...prevDetails,
          movie: response.data,
        }));

        // Fetch additional data like cast, crew, etc.
        const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574',
          }
        });
        setMovieDetails((prevDetails) => ({
          ...prevDetails,
          cast: castResponse.data.cast,
          crew: castResponse.data.crew,
        }));

        const videosResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574',
          }
        });
        setMovieDetails((prevDetails) => ({
          ...prevDetails,
          videos: videosResponse.data.results,
        }));

        const imagesResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
          params: {
            api_key: 'f10ad5116962b95dec6775837d225574',
          }
        });
        setMovieDetails((prevDetails) => ({
          ...prevDetails,
          images: imagesResponse.data.backdrops,
        }));
      } catch (err) {
        setError('Failed to fetch movie details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const { movie, cast, crew, videos, images } = movieDetails;

  return (
    <div className="movie-details">
      {movie && (
        <div>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p>Release Date: {movie.release_date}</p>
          <p>Rating: {movie.vote_average}</p>

          {images.length > 0 && (
            <div>
              <h2>Images</h2>
              <img src={`https://image.tmdb.org/t/p/w500${images[0].file_path}`} alt="Movie" />
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h2>Videos</h2>
              <a href={`https://www.youtube.com/watch?v=${videos[0].key}`} target="_blank" rel="noopener noreferrer">
                Watch Trailer
              </a>
            </div>
          )}

          <h2>Cast</h2>
          <ul>
            {cast.map((actor) => (
              <li key={actor.cast_id}>
                {actor.name} as {actor.character}
              </li>
            ))}
          </ul>

          <h2>Crew</h2>
          <ul>
            {crew.map((member) => (
              <li key={member.id}>
                {member.name} ({member.job})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
