import styled from 'styled-components';
import { PieChart } from './Pie';
import GenreData from './genreData';

const ChartContainer = styled.div`
  position: relative;
  top: 16vh;
  text-align: center; // 차트와 타이틀을 중앙 정렬
  padding-bottom: 80px; // 영화 목록과의 간격
`;

const ChartTopInfo = styled.div`
  position: relative;
  width: 410px;
  height: 79px;
  left: 10vw;
  top: 25vh;
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 35px;
  color: #f4f3f3;
  text-align: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid #535d7e;
`;

const ChartImage = styled.div`
  position: relative;
  display: inline-block; // 차트를 인라인 블록으로 만들어 중앙 정렬 가능하게 함
  margin: auto;
`;

function Chart({ setSelectedGenre, selectedGenre, responseData }) {
  const genreData = GenreData();

  if (genreData.topGenres && genreData.topGenres.length > 0) {
    const firstGenreId = genreData.topGenres[0];
    const firstGenreCount = genreData.genreCounts[firstGenreId];

    const secondGenreId = genreData.topGenres[1];
    const secondGenreCount = genreData.genreCounts[secondGenreId];

    const thirdGenreId = genreData.topGenres[2];
    const thirdGenreCount = genreData.genreCounts[thirdGenreId];

    console.log(`장르 ID ${firstGenreId}의 등장 횟수:`, firstGenreCount);
    console.log(`장르 ID ${secondGenreId}의 등장 횟수:`, secondGenreCount);
    console.log(`장르 ID ${thirdGenreId}의 등장 횟수:`, thirdGenreCount);
  }
  return (
    <ChartContainer>
      <ChartTopInfo>
        {localStorage.username}님의 관람 기록중
        <br /> 가장 많이 보신 장르 top3입니다.
      </ChartTopInfo>
      <ChartImage>
        <PieChart
          selectedGenre={selectedGenre}
          responseData={responseData}
          setSelectedGenre={setSelectedGenre}
        />
      </ChartImage>
    </ChartContainer>
  );
}

export default Chart;
