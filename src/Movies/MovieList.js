import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CriticAvatar from '../rive/CriticAvatar';
import { useTeddy } from '../rive/TeddyContext';


export default function MovieList(props) {
  const navigate = useNavigate()
  const teddy = useTeddy();
  const onMovieClick = id => () => {
    navigate(`/movies/${id}`)
  }

  // Leaving the list (e.g. clicking a card) skips pointerleave, so reset Teddy here
  useEffect(() => () => teddy.relax(), [teddy]);

  return (
    <div
      className="movie-list"
      onPointerMove={e => teddy.lookAt(e.clientX / window.innerWidth)}
      onPointerLeave={() => teddy.stopLooking()}
    >
      {props.movies.map(movie => (
        <MovieDetails
        link={<Link to={`movies/${movie.id}`}>details</Link>}
         onMovieClick={onMovieClick(movie.id)}
          key={movie.id}
           movie={movie}
            />
      ))}
    </div>
  );
}

function MovieDetails(props) {

  const { id, title, director, metascore } = props.movie;
  const { onMovieClick, link } = props
  const teddy = useTeddy();
  // Teddy can't bear to look at anything scoring under 80
  const isScary = metascore < 80;

  return (
    <div
      className="movie-card"
      onClick={onMovieClick}
      onPointerEnter={() => isScary && teddy.coverEyes(true)}
      onPointerLeave={() => isScary && teddy.coverEyes(false)}
    >
      <CriticAvatar id={id} metascore={metascore} />
      <h2>{title}</h2>
      <div className="movie-director">
        Director: <em>{director}</em>
      </div>
      <div className="movie-metascore">
        Metascore: <strong>{metascore}</strong>
      </div>
      {link}
    </div>
  );
}
