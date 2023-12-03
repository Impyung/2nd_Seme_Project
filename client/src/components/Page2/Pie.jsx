//Pie.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Chart from './Chart';
import GenreData from './GenreData';
ChartJS.register(ArcElement, Tooltip, Legend);
export function PieChart({ selectedGenre, responseData, setSelectedGenre }) {
  const [tvGenres, setTVGenres] = useState({}); // 장르 데이터를 저장할 상태
  const { topGenres = [], genreCounts = {} } = GenreData();

  // API로부터 장르 데이터 가져오기
  useEffect(() => {
    const apiKey = 'c4e59022826dc465ea5620d6adaa6813';
    const tvGenreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko`;

    fetch(tvGenreUrl)
      .then((response) => response.json())
      .then((data) => {
        setTVGenres(
          data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {})
        );
      })
      .catch((error) => console.error(error));
  }, []);

  // 장르 데이터를 사용하여 차트 데이터 생성
  const genreLabels = topGenres.map((genreId) => tvGenres[genreId] || genreId);
  const genreCountsData = topGenres.map((genreId) => genreCounts[genreId] || 0);

  const data = {
    labels: genreLabels,
    datasets: [
      {
        label: '관람한 영화 수',
        data: genreCountsData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          // 'rgba(75, 192, 192, 0.2)', // 초록색으로 변경 (액션)
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          // 'rgba(75, 192, 192, 1)', // 초록색으로 변경 (액션)
        ],
        borderWidth: 1,
      },
    ],
  };
  // onGenreSelect 추가} {
  console.log('onGenreSelect prop in PieChart:', setSelectedGenre);
  const [selectedInfo, setSelectedInfo] = useState(''); // 클릭된 섹션 정보를 저장할 상태
  const options = {
    plugins: {
      legend: {
        position: 'bottom', // 범례 위치를 하단으로 설정
        labels: {
          color: 'white',
          font: {
            family: 'GmarketSansTTFLight',
          },
        },
      },
      tooltip: {
        color: 'white',
        bodyFont: {
          family: 'GmarketSansTTFLight',
        },
      },
    },
    onClick: (event, elements) => {
      if (!elements.length) return; // 클릭된 섹션이 없으면 리턴

      const clickedElementIndex = elements[0].index; // 클릭된 섹션의 인덱스
      const label = data.labels[clickedElementIndex]; // 클릭된 섹션의 라벨 (장르)
      console.log('Label:', label);
      setSelectedGenre(label); // 상위 컴포넌트의 함수 호출
    },
  };
  return (
    <>
      {/* <GuideText>추천받고 싶은 장르를 차트에서 클릭해주세요</GuideText> */}
      <Pie data={data} options={options} />
      {selectedInfo && (
        <div
          style={{
            color: 'white',
            fontSize: '18px', // 폰트 크기 조정
            textAlign: 'center', // 텍스트 중앙 정렬
            fontFamily: 'Noto Sans KR, sans-serif',
          }}
        >
          {selectedInfo}
        </div>
      )}
    </>
  );
}
