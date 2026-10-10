import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CriticAvatar from '../rive/CriticAvatar';

export default function Movie({ saved, addToSavedList }) {
  const [movie, setMovie] = useState();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/movies/${id}`)
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  const saveMovie = () => {
    addToSavedList(movie.id);
  };

  if (!movie) {
    return <div>Loading movie information...</div>;
  }

  const { title, director, metascore, stars } = movie;
  const isSaved = saved.includes(movie.id);

  return (
    <div className="save-wrapper">
      <div className="movie-card">
        <CriticAvatar key={movie.id} id={movie.id} metascore={metascore} />
        <h2>{title}</h2>
        <div className="movie-director">
          Director: <em>{director}</em>
        </div>
        <div className="movie-metascore">
          Metascore: <strong>{metascore}</strong>
        </div>
        <h3>Actors</h3>
        {stars.map(star => (
          <div key={star} className="movie-star">
            {star}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={saveMovie}
        className={isSaved ? 'save-button saved' : 'save-button'}
      >
        {isSaved ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  );
}
