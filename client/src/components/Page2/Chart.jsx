import styled from 'styled-components';
import { PieChart } from './Pie';
import useFetchData from './FetchData';
import axios from 'axios';

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
  const { data, loading, error } = useFetchData(
    'http://localhost:3000/userRecord/'
  );

  console.log('데이터입니다', data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (Array.isArray(data) && data.length > 0) {
    const allGenreIds = data?.flatMap((item) => item.genre_ids);

    const genreCounts = allGenreIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    // 가장 많이 등장하는 genre_ids를 찾습니다.
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((item) => item[0]);

    // 결과를 콘솔에 출력합니다.

    // 이거 화면에 표시하는 데이터로 사용하시면 됩니다.
    console.log('Top 3 genres:', topGenres, genreCounts);
  } else {
    console.log('데이터가 없거나 배열이 아닙니다.');
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
