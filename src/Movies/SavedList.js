import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SavedList(props) {
  const navigate = useNavigate();
  
  return (
    <div className="saved-list">
      <h3>Saved Movies:</h3>
      {props.list.map(id => {
        const movie = props.movies.find(movie => movie.id === id);
        return movie ? (
          <Link key={id} to={`/movies/${id}`} className="saved-movie">
            {movie.title}
          </Link>
        ) : null;
      })}
      <div onClick={() => navigate('/')} className="home-button">Home</div>
    </div>
  );
}
