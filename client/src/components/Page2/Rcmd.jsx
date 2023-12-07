//Rcmd.jsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; // Import useEffect and useState
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
const TextInfo = styled.div`
  width: 40vw;
  margin: 0 auto;
  font-size: 18px;
  color: #f4f3f3;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: 'Noto Sans KR', sans-serif;
  border: 1px solid #535d7e;
  top: 11vh;
  position: relative;
`;
const TextInfo2 = styled.div`
  width: 40vw;
  height: 11vh;
  margin: 0 auto;
  font-size: 24px;
  color: #f4f3f3;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: 'Noto Sans KR', sans-serif;
  border: 1px solid #535d7e;
  margin-top: 10vh;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ImageInfo = styled.div`
  position: relative;
  border-radius: 10px;
  width: 194px;
  height: 285px;
  background: #d9d9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: black;
`;

const GradeInfo = styled.div`
  position: absolute;
  font-family: 'Noto Sans KR';
  bottom: -37px;
  left: 0;
  width: 65px;
  height: 27px;
  background: #1c1e2c;
  border-radius: 5px;
  font-family: 'Noto Sans KR';
  font-weight: 600;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    if (props.rating >= 8.5) {
      return '#4D96FF';
    } else if (props.rating >= 7.5) {
      return '#6BCB77';
    } else if (props.rating >= 6.5) {
      return '#FFD93D';
    } else {
      return '#FF6B6B';
    }
  }};
`;

const ReservInfo = styled.button`
  position: absolute;
  bottom: -37px;
  right: 0;
  width: 119px;
  height: 27px;
  border-radius: 5px;
  background-color: #898fc0;
  color: black;
  font-family: 'Noto Sans KR';
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    background: #4f526b;
    transform: translateY(+2px); // 클릭 유도를 위한 애니메이션 효과
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

// Arrow styles
const Arrow = styled.div`
  cursor: pointer;
  position: absolute;
  top: 100vh;
  width: 6vw;
  transform: translateY(-50%);
  z-index: 1000; // Ensure arrows are above other elements
  // Conditional styling based on props
  ${(props) => (props.direction === 'left' ? 'left: 0;' : 'right: 0;')}
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 2vh 8vh;
  margin: 0 auto;
  margin-top: 11vh;
  width: auto;
  max-width: 82vw;
  height: 45vh;
  position: relative;

  &::-webkit-scrollbar {
    height: 10px; // 스크롤바 높이 설정
    background-color: #2c3440; // 스크롤바 배경 색상
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f5b93; // 스크롤바 썸(움직이는 부분) 색상
    border-radius: 5px; // 썸 둥근 모서리
    &:hover {
      background-color: #6d7ba4; // 스크롤바 썸 호버 시 색상 변경
    }
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; // 스크롤바 트랙 내부에 그림자 효과
    border-radius: 10px; // 트랙 둥근 모서리
  }

  /* Firefox를 위한 스크롤바 스타일 */
  scrollbar-width: thin;
  scrollbar-color: #4f5b93 #2c3440;
`;

function Rcmd({ selectedGenre }) {
  useEffect(() => {
    if (selectedGenre) {
      // 다른 로직 ...
      // 스크롤을 이동시키는 부분
      const scrollContainerPosition = scrollRef.current.offsetTop;
      window.scrollTo({
        top: scrollContainerPosition,
        behavior: 'smooth',
      });
    }
  }, [selectedGenre]);

  const scrollRef = useRef(null);

  // Function to scroll left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -244, behavior: 'smooth' }); // scroll by the width of one movie container plus gap
  };

  // Function to scroll right
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 244, behavior: 'smooth' }); // scroll by the width of one movie container plus gap
  };

  const [recommendations, setRecommendations] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);

  const fetchMovieDetails = async (titles) => {
    const KEY = '0d38cc635c10e090910f3d7ea7194e05'; // TMDb API 키
    const URL = 'https://api.themoviedb.org/3';

    const promises = titles.map(async (title) => {
      // console.log("Fetching movie details for titles: ", titles);

      const tmdbResponse = await fetch(
        `${URL}/search/movie?api_key=${KEY}&language=ko-KR&page=1&query=${title}`
      );
      const tmdbJson = await tmdbResponse.json();
      const movie = tmdbJson.results[0];
      if (movie) {
        return {
          title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          vote_average: movie.vote_average,
          // 추가적으로 필요한 정보를 여기에 추가
        };
      }
      return { title, posterUrl: null, vote_average: null };
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    // console.log('Selected Genre: ', selectedGenre);
    fetch(
      `http://localhost:5000/nowplaying?watched_genres=${encodeURIComponent(
        selectedGenre
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.recommendations) {
          setRecommendations(data.recommendations);
          return fetchMovieDetails(data.recommendations);
        }
      })
      .then((movieDetails) => {
        // console.log('Fetched movie details: ', movieDetails);
        setMovieDetails(movieDetails);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, [selectedGenre]);

  const calculateScrollContainerPosition = (movieCount) => {
    if (movieCount > 5) {
      return '11vh'; // 원하는 위치로 설정
    } else {
      return '11vh'; // 다른 위치로 설정
    }
  };
  const ImageData = () => {};

  const GradeData = () => {};

  const ReservData = () => {};

  return (
    <>
      {!selectedGenre && <TextInfo2>Waiting...</TextInfo2>}

      {selectedGenre && ( // selectedGenre가 있을 때만 추천 영화를 표시합니다.
        <>
          <TextInfo>{selectedGenre} 장르의 추천 영화 목록입니다.</TextInfo>
          <Arrow direction="left" onClick={scrollLeft}>
            <MdChevronLeft size="3rem" />
          </Arrow>
          <ScrollContainer
            ref={scrollRef}
            style={{
              marginTop: calculateScrollContainerPosition(movieDetails.length),
              justifyContent: 'center'
            }}
          >
            {movieDetails.map((movie, index) => (
              <div key={index} style={{ minWidth: '200px' }}>
                <ImageInfo onClick={() => ImageData(movie)}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '10px',
                    }}
                  />
                  <GradeInfo rating={movie.vote_average}>
                    {movie.vote_average === 0
                      ? '합산중'
                      : movie.vote_average.toFixed(1)}
                  </GradeInfo>
                  <Link
              key={index}
              to={`/page4?voteAvg=${movie.vote_average}&posterUrl=${movie.posterUrl}&directorName=${movie.director}&releaseDate=${movie.release_date}&genres=${movie.genres}&title=${movie.title}`}
            >
              <ReservInfo onClick={() => ReservData(movie.title)}>
                예매
              </ReservInfo>
            </Link>
                </ImageInfo>
              </div>
            ))}
          </ScrollContainer>
          <Arrow direction="right" onClick={scrollRight}>
            <MdChevronRight size="3rem" />
          </Arrow>
        </>
      )}
    </>
  );
}

export default Rcmd;
