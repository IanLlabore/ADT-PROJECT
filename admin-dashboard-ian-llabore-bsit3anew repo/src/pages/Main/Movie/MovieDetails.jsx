import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // For custom arrow buttons
import './MovieDetails.css'; // Your custom styles

// Slick Carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [stills, setStills] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState('cast'); // Default to the Cast & Crew tab
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=f10ad5116962b95dec6775837d225574`);
        setMovie(movieRes.data);
      } catch (err) {
        console.error("Error fetching movie details", err);
      }
    };

    const fetchCastAndCrew = async () => {
      try {
        const castRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=f10ad5116962b95dec6775837d225574`);
        setCast(castRes.data.cast);
        setCrew(castRes.data.crew);
      } catch (err) {
        console.error("Error fetching cast and crew", err);
      }
    };

    const fetchStills = async () => {
      try {
        const stillsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=f10ad5116962b95dec6775837d225574`);
        setStills(stillsRes.data.backdrops); // Use backdrops for stills
      } catch (err) {
        console.error("Error fetching movie stills", err);
      }
    };

    const fetchVideos = async () => {
      try {
        const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=f10ad5116962b95dec6775837d225574`);
        setVideos(videosRes.data.results); // Videos such as trailers
      } catch (err) {
        console.error("Error fetching movie videos", err);
      }
    };

    fetchMovieDetails();
    fetchCastAndCrew();
    fetchStills();
    fetchVideos();
  }, [movieId]);

  // Show "View All" functionality for Cast & Crew
  const handleShowAllCast = () => setShowAllCast(!showAllCast);
  const handleShowAllCrew = () => setShowAllCrew(!showAllCrew);

  // Settings for Slick Carousel
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <FaArrowRight className="slick-arrow slick-next" />,
    prevArrow: <FaArrowLeft className="slick-arrow slick-prev" />,
  };

  return (
    <div>
      {movie && (
        <div className="movie-details">
          <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          </div>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p>Release Date: {movie.release_date}</p>
          <p>Rating: {movie.vote_average}</p>
          <p>Popularity: {movie.popularity}</p>
        </div>
      )}

      <div className="tabs">
        <button onClick={() => setTab('cast')}>Cast & Crew</button>
        <button onClick={() => setTab('photos')}>Photos</button>
        <button onClick={() => setTab('videos')}>Videos</button>
      </div>

      {tab === 'cast' && (
        <div className="cast-crew">
          <h2>Cast</h2>
          <div className="cast-list">
            {cast.slice(0, showAllCast ? cast.length : 10).map(actor => (
              <div key={actor.id}>
                <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
                <p>{actor.name}</p>
              </div>
            ))}
          </div>
          {cast.length > 10 && (
            <button onClick={handleShowAllCast}>{showAllCast ? 'Show Less' : 'View All'}</button>
          )}

          <h2>Crew</h2>
          <div className="crew-list">
            {crew.slice(0, showAllCrew ? crew.length : 10).map(member => (
              <div key={member.id}>
                <p>{member.name} ({member.job})</p>
              </div>
            ))}
          </div>
          {crew.length > 10 && (
            <button onClick={handleShowAllCrew}>{showAllCrew ? 'Show Less' : 'View All'}</button>
          )}
        </div>
      )}

      {tab === 'photos' && (
        <div className="photos">
          <h2>Movie Stills</h2>
          <Slider {...carouselSettings}>
            {stills.map(still => (
              <div key={still.file_path}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${still.file_path}`}
                  alt="Movie Still"
                  className="movie-still"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {tab === 'videos' && (
        <div className="videos">
          <h2>Videos</h2>
          {videos.length > 0 ? (
            <div>
              <h3>Trailer</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videos[0].key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Movie Trailer"
              ></iframe>
            </div>
          ) : (
            <p>No trailer available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
