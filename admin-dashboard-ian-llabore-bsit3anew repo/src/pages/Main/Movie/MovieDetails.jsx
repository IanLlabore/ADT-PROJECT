import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './MovieDetails.css'; // Your custom styles

// Slick Carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [selectedTab, setSelectedTab] = useState('cast');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // For the back button

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=f10ad5116962b95dec6775837d225574`);
        setMovie(res.data);

        const castRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=f10ad5116962b95dec6775837d225574`);
        setCast(castRes.data.cast);
        setCrew(castRes.data.crew);

        const photosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=f10ad5116962b95dec6775837d225574`);
        setPhotos(photosRes.data.backdrops);

        const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=f10ad5116962b95dec6775837d225574`);
        setVideos(videosRes.data.results);
      } catch (error) {
        setError("Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Handle tab switching
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Handle save movie
  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      alert('You must be logged in to save a movie.');
      return;
    }

    if (!movie) {
      alert('No movie details available to save.');
      return;
    }

    const data = {
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
      isFeatured: 0,
    };

    axios({
      method: 'post',
      url: '/movies', // Ensure this is the correct endpoint
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      alert('Movie saved successfully');
    })
    .catch((error) => {
      console.error('Error saving movie:', error.response || error);
      alert('There was an issue saving the movie.');
    });
  };

  const [isCastExpanded, setIsCastExpanded] = useState(false);
  const [isCrewExpanded, setIsCrewExpanded] = useState(false);
  const handleViewAllCast = () => {
    setIsCastExpanded(true);
  };
  
  const handleViewLessCast = () => {
    setIsCastExpanded(false);
  };
  
  const handleViewAllCrew = () => {
    setIsCrewExpanded(true);
  };
  
  const handleViewLessCrew = () => {
    setIsCrewExpanded(false);
  };



  const handleBackButtonClick = () => {
    navigate('/movies');  // Navigate back to the List page
  };

  return (
    <div className="movie-details">
      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && movie && (
        <>
          <div className="movie-header">
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h1>{movie.title}</h1>
              <div className="movie-description-box">
                <p>{movie.overview}</p>
              </div>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Rating:</strong> {movie.vote_average}</p>
              <p><strong>Popularity:</strong> {movie.popularity}</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="back-button">
            <button onClick={handleBackButtonClick}><FaArrowLeft /> Back to List</button>
          </div>

          <div className="tabs">
            <button onClick={() => handleTabChange('cast')} className={selectedTab === 'cast' ? 'active' : ''}>Cast & Crew</button>
            <button onClick={() => handleTabChange('photos')} className={selectedTab === 'photos' ? 'active' : ''}>Photos</button>
            <button onClick={() => handleTabChange('videos')} className={selectedTab === 'videos' ? 'active' : ''}>Videos</button>
          </div>

          {/* Save Movie Button */}
          <div className="save-buttons">
            <button onClick={handleSave}>Save Movie</button>
          </div>

          {/* Cast Section */}
          {selectedTab === 'cast' && (
            <div className="cast-crew">
              <h2>Cast</h2>
              <div className="cast-list">
                {cast.slice(0, isCastExpanded ? cast.length : 10).map((actor) => (
                  <div className="cast-member" key={actor.id}>
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}` : 'default-image.jpg'}
                      alt={actor.name}
                      className="actor-photo"
                    />
                    <div className="actor-info">
                      <p>{actor.name}</p>
                      <p>{actor.character}</p>
                    </div>
                  </div>
                ))}
                {cast.length > 10 && (
                  <button className="view-more" onClick={isCastExpanded ? handleViewLessCast : handleViewAllCast}>
                    {isCastExpanded ? 'View Less' : 'View All'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Crew Section */}
          {selectedTab === 'cast' && (
            <div className="cast-crew">
              <h2>Crew</h2>
              <div className="crew-list">
                {crew.slice(0, isCrewExpanded ? crew.length : 10).map((crewMember) => (
                  <div className="crew-member" key={crewMember.id}>
                    <img
                      src={crewMember.profile_path ? `https://image.tmdb.org/t/p/w500/${crewMember.profile_path}` : 'default-image.jpg'}
                      alt={crewMember.name}
                      className="crew-photo"
                    />
                    <div className="crew-info">
                      <p>{crewMember.name}</p>
                      <p>{crewMember.job}</p>
                    </div>
                  </div>
                ))}
                {crew.length > 10 && (
                  <button className="view-more" onClick={isCrewExpanded ? handleViewLessCrew : handleViewAllCrew}>
                    {isCrewExpanded ? 'View Less' : 'View All'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {selectedTab === 'photos' && (
            <div className="photos">
              <h2>Photos</h2>
              <Slider arrows={true}>
                {photos.map((photo, index) => (
                  <div key={index}>
                    <img
                      src={`https://image.tmdb.org/t/p/original/${photo.file_path}`}
                      alt={`Movie still ${index + 1}`}
                      className="movie-still"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {/* Videos Tab */}
          {selectedTab === 'videos' && (
            <div className="videos">
              <h2>Videos</h2>
              {videos.map((video, index) => (
                <div key={index} className="video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allowFullScreen
                    className="video-frame"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetails;
