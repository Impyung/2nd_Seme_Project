import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MoviesWrapper = styled.div`
  position: relative; // 이제 MoviesWrapper는 position context를 제공합니다.
  width: 90%; // 화면 너비의 80%를 사용
  margin: 0 auto; // 중앙 정렬
  padding-bottom: 5vh; // 하단 여백
`;
const MoviesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 80px; /* 원하는 간격 설정 */
  padding: 30px; /* 여백 설정 */
  justify-content: center; /* 가로 중앙 정렬 */
`;

const MovieContainer = styled.div`
  position: relative; // 이제 MovieContainer는 position context를 제공합니다.
  width: 194px;
  height: 295px; // GradeInfo와 ReservInfo를 포함할 공간을 확보해야 합니다.
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; // GradeInfo와 ReservInfo가 아래쪽에 위치할 공간을 확보합니다.
`;

const ImageInfo = styled.img`
  position: absolute;
  width: 194px;
  height: 285px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden; /* Ensure the image doesn't overflow the div */
`;

const GradeInfo = styled.div`
  position: absolute;
  bottom: -27px; /* 아래쪽 여백 설정 */
  left: 0px; /* 왼쪽 여백 설정 */
  width: 65px;
  height: 27px;
  background: #1c1e2c;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => {
    if (props.rating == 0) {
      return '17px';
    } else {
      return '20px';
    }
  }};
  display: flex;
  justify-content: center;
  line-height: 30px;
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
  bottom: -27px; /* 아래쪽 여백 설정 */
  right: 0px; /* 오른쪽 여백 설정 */
  width: 119px;
  height: 27px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #898fc0;
  color: black;
  font-family: 'inter';
  font-style: normal;
  font-weight: 600;
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

function MoreMovies() {
  const [movieData, setMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const ReservData = async (movieTitle) => {
    alert(`예매하기: "${movieTitle}"`);

    // 예매하기 버튼을 누르면, 해당 영화의 정보를 서버로 전송합니다.
    // 서버에서는 해당 영화의 정보를 데이터베이스에 저장합니다.

    const selectedTitle = movieTitle;

    console.log('title', selectedTitle);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    // 기존 로컬 서버로의 요청
    const localServerResponse = await axios.post(
      'http://localhost:3000/movieView',
      { title: selectedTitle },
      { headers }
    );

    console.log(localServerResponse.data);
  };

  const getMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=262b76947e7259fa05d3bd23195fd016&language=ko-KR&page=1`
      );
      const data = await res.json();
      const movies = data.results.slice(0, 20);
      getAdditionalMovieInfo(movies);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAdditionalMovieInfo = async (movies) => {
    const KEY = '0d38cc635c10e090910f3d7ea7194e05'; // TMDB API 키
    const URL = 'https://api.themoviedb.org/3';
    const promises = movies.map(async (movie) => {
      const movieDetailsResponse = await fetch(
        `${URL}/movie/${movie.id}?api_key=${KEY}&language=ko-KR&append_to_response=credits`
      );
      const movieDetailsJson = await movieDetailsResponse.json();
      const director = movieDetailsJson.credits.crew.find(
        (person) => person.job === 'Director'
      );
      const genres = movieDetailsJson.genres
        .slice(0, 2)
        .map((genre) => genre.name);
      return {
        title: movie.title,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        director: director ? director.name : 'Director not found',
        genres: genres.join(' / '),
      };
    });
    const moviesWithAdditionalInfo = await Promise.all(promises);
    setMovieData(moviesWithAdditionalInfo);
  };

  useEffect(() => {
    getMovies();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <MoviesWrapper>
      <div
        style={{
          width: '100%',
          margin: '10rem auto',
          marginTop: '8rem',
          marginBottom: '4rem',
        }}
      >
        <hr />
        <h2
          style={{ fontSize: '1.6vw', fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          무비 차트
        </h2>
      </div>
      <MoviesGrid>
        {movieData.map((movie, index) => (
          <MovieContainer key={movie.id} index={index}>
            <ImageInfo
              src={`https://image.tmdb.org/t/p/w500/${movie.posterUrl}`}
              alt={`Poster of ${movie.title}`}
            />
            <GradeInfo rating={movie.vote_average}>
              {movie.vote_average === 0 ? 'X.X' : movie.vote_average.toFixed(1)}
            </GradeInfo>
            <Link
              key={index}
              to={`/page4?voteAvg=${movie.vote_average}&posterUrl=${movie.posterUrl}&directorName=${movie.director}&releaseDate=${movie.release_date}&genres=${movie.genres}&title=${movie.title}`}
            >
              <ReservInfo onClick={() => ReservData(movie.title)}>
                예매
              </ReservInfo>
            </Link>
          </MovieContainer>
        ))}
      </MoviesGrid>
    </MoviesWrapper>
  );
}

export default MoreMovies;
