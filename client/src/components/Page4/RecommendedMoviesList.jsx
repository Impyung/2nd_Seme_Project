import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  overflow-x: auto;
  gap: 10px;
  padding: 10px;
  margin: 0 auto;
  width: 95%;

  &::-webkit-scrollbar {
    height: 15px; // 스크롤바 높이 조정
    background-color: #2c3440;
    cursor: pointer;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f5b93; // 스크롤바 색상 조정
    border-radius: 10px;
    border: 2px solid #2c3440;
    &:hover {
      background-color: #6d7ba4; // 호버 색상 변경
    }
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #3c4452; // 트랙 내부에 그림자 효과 적용
    border-radius: 10px;
  }

  scrollbar-width: thin;
  scrollbar-color: #4f5b93 #2c3440;
`;

const TitleButton = styled.div`
  margin-top: 5px;
  font-size: 1rem;
  width: 160px;
  height: 40px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(0deg, #2a2f42 30%, #1c1e2c 70%);
  color: #f4f3f3;
  font-family: 'Noto Sans KR', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const DescriptionText = styled.div`
  top: 75vh;
  left: 7vw;
  width: 300px;
  position: absolute;
  font-weight: bold;
  margin-bottom: 20px; // 텍스트와 스크롤 컨테이너 사이의 간격
  font-size: 1.5rem; // 폰트 크기
  color: #f4f3f3; // 폰트 색상
  text-align: center; // 중앙 정렬
  font-family: 'Noto Sans KR', sans-serif; // 나눔고딕으로 폰트 변경
`;
const RecommendedMoviesList = ({ title }) => {
  const [detailedRecommendations, setDetailedRecommendations] = useState([]);

  useEffect(() => {
    const fetchDetailedRecommendations = async () => {
      try {
        // 추천된 영화 제목 가져오기
        const response = await axios.get(
          'https://43.200.133.130:5000/movies?title=' +
            encodeURIComponent(title)
        );
        const recommendedTitles = response.data.recommendations;

        // 각 추천된 영화에 대한 상세 정보 가져오기
        const detailedInfo = await Promise.all(
          recommendedTitles.map(async (title) => {
            const movieResponse = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=0d38cc635c10e090910f3d7ea7194e05&language=ko-KR&query=${encodeURIComponent(
                title
              )}`
            );
            const movieData = await movieResponse.json();
            return movieData.results[0]; // 첫 번째 결과를 사용
          })
        );

        setDetailedRecommendations(detailedInfo);
      } catch (error) {
        console.error('Error fetching detailed recommendations:', error);
      }
    };

    fetchDetailedRecommendations();
  }, [title]);
  // 영화 포스터 스타일
  const posterStyle = {
    width: '160px',
    height: '240px',
    objectFit: 'cover',
    borderRadius: '5px',
  };

  // 영화 아이템 스타일
  const itemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '10px',
  };

  return (
    <>
      <DescriptionText>
        선택하신
        <br /> "{title}" 영화와 <br /> 유사한 영화들입니다.
      </DescriptionText>
      <ScrollContainer>
        {detailedRecommendations.map((movie, index) => (
          <div key={index} style={itemStyle}>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={posterStyle}
              />
            )}
            <TitleButton>{movie.title}</TitleButton>
          </div>
        ))}
      </ScrollContainer>
    </>
  );
};

export default RecommendedMoviesList;
