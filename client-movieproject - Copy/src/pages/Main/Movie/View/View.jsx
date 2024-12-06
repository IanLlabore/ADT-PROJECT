import { useEffect, useState } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css'; // Custom CSS file for styling

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [tmdbId, setTmdbId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for different movie sections
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  
  // State to handle active tab
  const [activeTab, setActiveTab] = useState('cast');

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          setTmdbId(response.data.tmdbId);
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
  }, [movieId]);

  useEffect(() => {
    if (tmdbId) {
      setIsLoading(true);
      setError(null);
      
      axios
        .get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=f10ad5116962b95dec6775837d225574`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          setError('Failed to load movie details.');
        });

      axios
        .get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=f10ad5116962b95dec6775837d225574`)
        .then((response) => {
          setCast(response.data.cast);
          setCrew(response.data.crew);
        })
        .catch((e) => {
          console.log(e);
          setError('Failed to load cast and crew.');
        });

      axios
        .get(`https://api.themoviedb.org/3/movie/${tmdbId}/images?api_key=f10ad5116962b95dec6775837d225574`)
        .then((response) => {
          setPhotos(response.data.backdrops);
        })
        .catch((e) => {
          console.log(e);
          setError('Failed to load photos.');
        });

      axios
        .get(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=f10ad5116962b95dec6775837d225574`)
        .then((response) => {
          setVideos(response.data.results);
        })
        .catch((e) => {
          console.log(e);
          setError('Failed to load videos.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [tmdbId]);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {movie && (
        <>
          <div className="movie-banner">
            <h1>{movie.title}</h1>
            <button className="return-button" onClick={() => navigate('/')}>Return to Home</button>
          </div>
          
          <div className="movie-info">
            <h3>{movie.overview}</h3>
            <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
            <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
            <p><strong>Popularity:</strong> {movie.popularity}</p>
          </div>

          {/* Tabs for Cast & Crew, Photos, and Videos */}
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'cast' ? 'active' : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              Cast & Crew
            </button>
            <button
              className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </button>
            <button
              className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
          </div>

          {/* Render Active Tab Content */}
          {activeTab === 'cast' && cast.length > 0 && (
            <div className="section cast">
              <h2>Cast</h2>
              <div className="cast-list">
                {cast.map((actor) => (
                  <div key={actor.id} className="cast-member">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="actor-photo"
                    />
                    <p>{actor.name} as <strong>{actor.character}</strong></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && photos.length > 0 && (
            <div className="section photos">
              <h2>Photos</h2>
              <div className="photo-carousel">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`https://image.tmdb.org/t/p/original/${photo.file_path}`}
                    alt={`Movie still ${index + 1}`}
                    className="movie-photo"
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && videos.length > 0 && (
            <div className="section videos">
              <h2>Videos</h2>
              <div className="video-list">
                {videos.map((video, index) => (
                  <div key={index} className="video-item">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allowFullScreen
                      className="video-frame"
                    />
                    <p>{video.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default View;
