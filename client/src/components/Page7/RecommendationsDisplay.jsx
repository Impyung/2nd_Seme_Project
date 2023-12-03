import React from 'react';
import styled from 'styled-components';
// Styled container with custom scrollbar
const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  overflow-x: auto;
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
  width: 80%;

  &::-webkit-scrollbar {
    height: 15px; // 스크롤바 높이 조정
    background-color: #2C3440;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4F5B93; // 스크롤바 색상 조정
    border-radius: 10px;
    border: 2px solid #2C3440;
    &:hover {
      background-color: #6D7BA4; // 호버 색상 변경
    }
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #3C4452; // 트랙 내부에 그림자 효과 적용
    border-radius: 10px;
  }

  scrollbar-width: thin;
  scrollbar-color: #4F5B93 #2C3440;
`;

const TitleButton = styled.button`
  margin-top: 5px;
  font-size: 1rem;
  width: 200px;
  height: 40px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(0deg, #2A2F42 30%, #1C1E2C 70%);
  color: #f4f3f3;
  font-family: 'Noto Sans KR', sans-serif;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    background-color: #1C1E2C;
    transform: translateY(-2px); // Slight lift on hover
  }

  &:active {
    transform: translateY(1px); // Depress button on click
  }
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
    width: '200px', // Correct the typo "130x" to "130px"
    height:'300px',
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
           <TitleButton onClick={() => onMovieSelect(movie.title)}>
            {movie.title}
          </TitleButton>
        </div>
      ))}
    </ScrollContainer>
  );
}

export default RecommendationsDisplay;
