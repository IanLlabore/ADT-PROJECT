import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import './Cast.css';

const Cast = () => {
  const { movieId } = useParams();  // Correctly extract movieId
  const [castData, setCastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      setError('Movie ID is required.');
      return;
    }

    const fetchCastData = async () => {
      try {
        const response = await fetch(`http://localhost/movieproject-api/casts/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cast data');
        }
        const data = await response.json();
        setCastData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCastData();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Cast for Movie {movieId}</h1>
      {/* Render your cast data here */}
      <ul>
        {castData.map((castMember) => (
          <li key={castMember.id}>{castMember.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Cast;
