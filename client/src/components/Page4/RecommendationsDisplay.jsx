import React from 'react';
import styled from 'styled-components';
// Styled container with custom scrollbar
const ScrollContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding-left: 20px;
overflow-x: auto;
gap: 20px; // Adjust the gap between posters as needed
padding: 20px;
margin: 0 auto; // Centers the scroll container within its parent
width: 80%; // Take up 100% of the parent width

position: relative;
  &::-webkit-scrollbar {
    height: 15px;
    background-color: #2C3440;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1c1e2c;
    border-radius: 10px;
    border: 3px solid #2C3440;
    &:hover {
      background-color: #f4f3f3; // Changes the thumb color when hovered
    }
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; // Adds a shadow effect inside the track
    border-radius: 10px; // Rounded corners for the scrollbar track
  }

  /* For other browsers like Firefox */
  scrollbar-width: thin;
  scrollbar-color: #1c1e2c #2C3440;
`;
function RecommendationsDisplay({ recommendations, onMovieSelect }) {
   // Style for each individual item (movie)
   const itemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  // Style for the movie posters
  const posterStyle = {
    width: '150px', // Correct the typo "130x" to "130px"
    height:'225px',
    objectFit: 'cover',
    borderRadius: '5px',
  };

  return (
    <ScrollContainer>
      {recommendations.map((movie, index) => (
        <div key={index} style={itemStyle}>
          {movie.poster_path && (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={posterStyle} />
          )}
          <button onClick={() => onMovieSelect(movie.title)} style={{ marginTop: '5px', fontSize: '0.7rem', width:'150px', height:'30px', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:"nowrap", padding:'5px',fontFamily:'Noto sans KR',background: 'linear-gradient(0deg, #2a2f42 30%, #1c1e2c 70%)', color: '#f4f3f3'}}>
            {movie.title}
          </button>
        </div>
      ))}
    </ScrollContainer>
  );
}

export default RecommendationsDisplay;
