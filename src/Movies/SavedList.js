import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTeddy } from '../rive/TeddyContext';

export default function SavedList(props) {
  const navigate = useNavigate();
  const { Teddy } = useTeddy();

  return (
    <div className="saved-list">
      <Teddy className="teddy" role="img" aria-label="Teddy, your movie buddy" />
      <h3>Saved Movies:</h3>
      <div className="saved-movies">
        {props.list.length === 0 && <span className="saved-empty">Nothing saved yet</span>}
        {props.list.map(id => {
          const movie = props.movies.find(movie => movie.id === id);
          return movie ? (
            <Link key={id} to={`/movies/${id}`} className="saved-movie">
              {movie.title}
            </Link>
          ) : null;
        })}
      </div>
      <div onClick={() => navigate('/')} className="home-button">Home</div>
    </div>
  );
}
