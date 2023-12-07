import React from 'react';
import styled from 'styled-components';


function SelectedMoviesDisplay({ selectedMovies, getRecommendations }) {
  const MovieBox = styled.button`
  /* position: relative; */
  height: 40vh;
  /* left: 10vw; */
  display: flex; // Use flexbox
  /* flex-direction: row; // Align items horizontally */
  align-items: center; // Center items vertically
  /* justify-content: center; */
  cursor: pointer;
  background-color: #1C1E2C;
  color: #f4f3f3;
  transition: all 0.2s ease;
  &:hover {
    background: #4F526B;
    transform: translateY(+2px); // 클릭 유도를 위한 애니메이션 효과
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

const MovieText = styled.div`
    width: 170px;
    height: 225px;
    margin-left: 20px;
    overflow: hidden; // Enable scrolling for overflowing text
    /* display: flex;
    flex-direction: column; */
`;

  // Style for the movie container
  const movieContainerStyle = {
    // display: 'flex',
    // flexDirection: 'column', // Stack items vertically
    // alignItems: 'center', // Center items horizontally
    // margin: '20px', // Space around each movie container
  };

  // Style for the poster image
  const posterStyle = {
    width: '150px', // Increased width
    height: '225px', // Adjust height proportionally
    borderRadius: '10px', // Optional: rounded corners for the poster
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Optional: drop shadow for depth
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        overflow:'hidden',
        justifyContent:'center'
      }}
    >
      {selectedMovies.map((movie, index) => (
        <div key={index} style={movieContainerStyle}>
          <MovieBox onClick={() => getRecommendations(movie.title)}>
            {/* <button onClick={() => getRecommendations(movie.title)} style={{ width: '400px', marginTop: '5px', display: 'flex', alignItems: 'center' }}> */}
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={posterStyle}
              />
            )}
            <MovieText>
              <strong>{movie.title || 'Select a movie'}({movie.release_date && movie.release_date.split('-')[0]})</strong>
              <p>평점 : {movie.vote_average}</p>
              <p style={{width:'150px',height:'225px',overflow:'auto', textAlign:'left',padding:'5px'}}>{movie.overview}</p>
            </MovieText>
          </MovieBox>
        </div>
      ))}
    </div>
  );
}

export default SelectedMoviesDisplay;
